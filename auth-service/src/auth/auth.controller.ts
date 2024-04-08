import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('file'))
  async sinUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.signUp(signUpDto, file);
  }

  @Post('confirm/:token')
  async confim(@Param('token') token: string) {
    return this.authService.confirmEmail(token);
  }
}
