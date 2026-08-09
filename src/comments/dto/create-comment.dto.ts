import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'บทความนี้เนื้อหาดีมากครับ!',
    description: 'ข้อความความคิดเห็น',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกข้อความความคิดเห็น' })
  message!: string; // แก้เป็น message ให้ตรงกับ Schema
}
