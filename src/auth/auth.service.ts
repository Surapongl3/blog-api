import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Register
  async register(dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // 2. Login
  async login(dto: LoginDto) {
    // หา User จาก Email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    // ตรวจสอบ Password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    // ตรวจสอบสถานะ Active ตาม Functional Requirement
    if (!user.isActive) {
      throw new UnauthorizedException(
        'บัญชีของคุณยังไม่ได้รับการอนุมัติ (Active) จาก Super Admin',
      );
    }

    // สร้าง JWT Payload
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
