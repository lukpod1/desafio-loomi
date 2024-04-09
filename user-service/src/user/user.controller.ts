import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

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
  async updateProfilePicture(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // // Validate the received parameters
    // // ...
    // // Perform the upload of the received image to a cloud storage service (e.g., Amazon S3)
    // const imageUrl = await this.imageService.uploadImage(file);
    // // Update the user's profile picture URL in the database and Redis
    // await this.userService.updateProfilePicture(userId, imageUrl);
    return `Profile picture updated successfully ${userId} with ${file.filename}`;
  }
}
