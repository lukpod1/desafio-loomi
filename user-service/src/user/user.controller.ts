import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userSevice: UserService) {}

  @Get(':userId')
  getUserDetails(@Param('userId') userId: string): Promise<User> {
    return this.userSevice.getUserDetails(userId);
  }

  @Patch(':userId')
  updateUserDetails(
    @Param('userId') userId: string,
    @Body() updateData: Partial<User>,
  ) {
    return this.userSevice.updateUserDetails(userId, updateData);
  }

  @Patch(':userId/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userSevice.updateProfilePicture(userId, file);
  }
}
