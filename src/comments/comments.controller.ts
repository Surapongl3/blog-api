import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'แสดงความคิดเห็นในบทความ' })
  create(
    @Param('blogId') blogId: string,
    @Request() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(blogId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงความคิดเห็นทั้งหมดของบทความ' })
  findByBlogId(@Param('blogId') blogId: string) {
    return this.commentsService.findByBlogId(blogId);
  }
}
