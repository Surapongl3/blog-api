import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'รูปแบบ Email ไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอก Email' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอก Password' })
  password!: string;
}
