import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  // 1. สร้างบทความ
  async create(dto: CreateBlogDto, userId: string) {
    return this.prisma.blog.create({
      data: {
        ...dto,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }

  // 2. ดึงบทความทั้งหมด + ค้นหาคำคล้าย (Search)
  async findAll(search?: string) {
    return this.prisma.blog.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. ดึงบทความตาม ID
  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        comments: {
          include: { author: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!blog) throw new NotFoundException('ไม่พบบทความนี้');
    return blog;
  }

  // 4. แก้ไขบทความ (เฉพาะผู้สร้างเท่านั้น)
  async update(id: string, dto: UpdateBlogDto, userId: string) {
    const blog = await this.findOne(id);

    if (blog.authorId !== userId) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขบทความนี้ (เฉพาะผู้สร้างเท่านั้น)');
    }

    return this.prisma.blog.update({
      where: { id },
      data: dto,
    });
  }

  // 5. ลบบทความ (ผู้สร้าง หรือ Super Admin)
  async remove(id: string, userId: string, userRole: Role) {
    const blog = await this.findOne(id);

    const isOwner = blog.authorId === userId;
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;

    if (!isOwner && !isSuperAdmin) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบบทความนี้');
    }

    return this.prisma.blog.delete({ where: { id } });
  }
}