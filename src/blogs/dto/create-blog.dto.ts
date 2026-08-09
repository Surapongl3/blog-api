import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'เริ่มต้นใช้งาน NestJS',
    description: 'หัวข้อบทความ',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกหัวข้อบทความ' })
  title!: string;

  @ApiProperty({
    example: 'เนื้อหาแนะนำการเขียน NestJS เบื้องต้น...',
    description: 'เนื้อหาบทความ',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกเนื้อหาบทความ' })
  content!: string;
}
