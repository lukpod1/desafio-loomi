/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { EmailService } from './services/email/email.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailSevice: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto, _file: Express.Multer.File) {
    const user = await this.createUser(signUpDto, _file);

    await this.checkIfUserExists(user.id);
    await this.storeUserInCache(user);
    await this.sendWelcomeEmail(user);
  }

  private async createUser(
    signUpDto: SignUpDto,
    _file: Express.Multer.File,
  ): Promise<User> {
    const user = new User();
    user.id = randomUUID();
    user.name = signUpDto.name;
    user.email = signUpDto.email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(signUpDto.password, user.salt);
    user.address = signUpDto.address;
    user.bankingDetails = signUpDto.bankingDetails;
    user.pictureProfile = _file ? _file.buffer.toString('base64') : '';
    return user;
  }

  private async checkIfUserExists(userId: string) {
    const existingUser = await this.cacheManager.get(userId);
    if (existingUser) {
      throw new ConflictException('A user with this id already exists');
    }
  }

  private async storeUserInCache(user: User) {
    await this.cacheManager.set(user.id, user, 1800);
    this.logger.log(`User with id ${user.id} has been created in Redis`);
  }

  private async sendWelcomeEmail(user: User) {
    try {
      await this.emailSevice.sendEmail(user.email, user.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
