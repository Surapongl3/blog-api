import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. ค้นหาผู้ใช้ด้วย Email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // 2. ค้นหาผู้ใช้ด้วย ID
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('ไม่พบผู้ใช้งานนี้');
    const { password, ...result } = user;
    return result;
  }

  // 3. สร้าง User ใหม่ (สำหรับ Register)
  async create(dto: CreateUserDto) {
    // เช็กว่า Email ซ้ำไหม
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email นี้ถูกใช้งานแล้วในระบบ');
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // สร้าง User (isActive จะเป็น false โดยอัตโนมัติจาก Schema)
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  // 4. ฟังก์ชันสำหรับ Super Admin ในการ Active User
  async activateUser(id: string) {
    await this.findById(id); // ตรวจสอบว่ามี user หรือไม่
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        role: true,
      },
    });
  }

  // 5. ดึงรายชื่อ User ทั้งหมด (สำหรับ Admin)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
