import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'Username ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' })
  @MaxLength(20, { message: 'Username ต้องมีความยาวไม่เกิน 20 ตัวอักษร' })
  @IsNotEmpty({ message: 'กรุณากรอก Username' })
  username!: string; 

  @IsEmail({}, { message: 'รูปแบบ Email ไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอก Email' })
  email!: string; 
  @IsString()
  @MinLength(8, { message: 'Password ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
  @IsNotEmpty({ message: 'กรุณากรอก Password' })
  password!: string; 
}
