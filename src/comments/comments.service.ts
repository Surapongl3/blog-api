import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(blogId: string, authorId: string, dto: CreateCommentDto) {
    // ตรวจสอบก่อนว่า Blog มีอยู่จริงหรือไม่
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('ไม่พบบทความที่ต้องการคอมเมนต์');
    }

    return this.prisma.comment.create({
      data: {
        message: dto.message,
        blogId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findByBlogId(blogId: string) {
    return this.prisma.comment.findMany({
      where: { blogId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}