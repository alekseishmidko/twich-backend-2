import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';
import { hash, verify } from 'argon2';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';
import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input';
import type { User } from '@prisma/generated';
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input';

@Injectable()
export class AccountService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  public async me(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        socialLinks: true,
        // stream: true,
        // notificationSettings: true,
      },
    });

    return user;
  }

  public async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const isUsernameExists = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExists) {
      throw new ConflictException('Это имя пользователя уже занято');
    }

    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExists) {
      throw new ConflictException('Эта почта уже занята');
    }

    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
        // stream: {
        //   create: {
        //     title: `Стрим ${username}`,
        //   },
        // },
        // notificationSettings: {
        //   create: {},
        // },
      },
    });

    if (!IS_DEV_ENV) {
      await this.verificationService.sendVerificationToken(user);
    }

    return true;
  }

  public async changeEmail(user: User, input: ChangeEmailInput) {
    const { email } = input;

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
      },
    });

    return true;
  }

  public async changePassword(user: User, input: ChangePasswordInput) {
    const { oldPassword, newPassword } = input;

    const isValidPassword = await verify(user.password, oldPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный старый пароль');
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hash(newPassword),
      },
    });

    return true;
  }
}
