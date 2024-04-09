import { Body, Controller, Get, Param, UploadedFile } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userSevice: UserService) {}

  @Get(':userId')
  getUserDetails(@Param('userId') userId: string) {
    return this.userSevice.getUserDetails(userId);
  }

  @Patch(':userId')
  updateUserDetails(
    @Param('userId') userId: string,
    @Body() updateData: Partial<User>,
  ) {
    // // Validate the received parameters
    // // ...

    // // Fetch user details from cache
    // const userDetails = await this.userService.getUserDetails(userId);

    // // Merge existing user data with the new data provided in the request
    // const updatedUser = { ...userDetails, ...updateData };

    // // Update the specified fields in the database and Redis
    // await this.userService.updateUser(userId, updatedUser);

    return `Update successful ${userId} with ${JSON.stringify(updateData)}`;
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
