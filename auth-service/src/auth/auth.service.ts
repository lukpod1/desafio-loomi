/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from './services/email/email.service';
import { CacheService } from './services/cache/cache.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private cacheService: CacheService,
    private emailSevice: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto, _file: Express.Multer.File) {
    const user = await this.createUser(signUpDto, _file);

    const token = randomUUID();

    await this.checkIfUserExists(token);
    await this.storeUserInCacheTemp(user, token);
    await this.sendConfirmationEmail(user, token);
  }

  async confirmEmail(token: string) {
    const user = await this.cacheService.get(token, true);
    if (!user) {
      throw new ConflictException('Invalid token');
    }

    //await this.userRepository.save(user);

    //await this.cacheManager.del(token);

    return { message: 'User confirmed' };
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
    const existingUser = await this.cacheService.get(userId, true);
    if (existingUser) {
      throw new ConflictException('A user with this id already exists');
    }
  }

  private async storeUserInCacheTemp(user: User, token: string) {
    await this.cacheService.set({ key: token, value: user }, true, 1800);
    this.logger.log(
      `User with id ${user.id} and token_confirm ${token} has been created in Redis`,
    );
  }

  private async sendConfirmationEmail(user: User, token: string) {
    try {
      await this.emailSevice.sendEmail(user.email, token);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
