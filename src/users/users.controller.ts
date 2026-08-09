import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth') 
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ดึงรายการ User ทั้งหมด (เฉพาะ Super Admin)
  @Get()
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // Super Admin กด Active User ตาม ID
  @Patch(':id/activate')
  @Roles(Role.SUPER_ADMIN)
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }
}
