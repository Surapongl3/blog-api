import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Blogs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiOperation({ summary: 'สร้างบทความใหม่' })
  @Post()
  create(@Body() dto: CreateBlogDto, @Request() req: any) {
    return this.blogsService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'ดึงบทความทั้งหมด หรือค้นหาคำคล้าย' })
  @ApiQuery({ name: 'search', required: false, description: 'คำค้นหาใน Title หรือ Content' })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.blogsService.findAll(search);
  }

  @ApiOperation({ summary: 'ดึงรายละเอียดบทความตาม ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @ApiOperation({ summary: 'แก้ไขบทความ (เฉพาะผู้สร้าง)' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto, @Request() req: any) {
    return this.blogsService.update(id, dto, req.user.id);
  }

  @ApiOperation({ summary: 'ลบบทความ (ผู้สร้าง หรือ Super Admin)' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.blogsService.remove(id, req.user.id, req.user.role);
  }
}