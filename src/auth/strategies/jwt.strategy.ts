// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service'; // ถอย 2 ชั้นเพราะย้ายลงโฟลเดอร์ย่อย

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey123',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'สิทธิ์การใช้งานไม่ถูกต้อง หรือบัญชีถูกระงับ',
      );
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
