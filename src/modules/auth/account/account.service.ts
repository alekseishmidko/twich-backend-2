import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
  public constructor(
    private readonly prismaService: PrismaService, // private readonly verificationService: VerificationService,
  ) {}

  public async findAll() {
    return this.prismaService.user.findMany();
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

    // await this.verificationService.sendVerificationToken(user);

    return true;
    // return user;
  }
}
