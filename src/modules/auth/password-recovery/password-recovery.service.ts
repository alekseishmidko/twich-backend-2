import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { $Enums } from '@prisma/generated';
import TokenType = $Enums.TokenType;
import { hash } from 'argon2';
import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { generateToken } from '@/src/shared/utils/generate-token';
import { ResetPasswordInput } from '@/src/modules/auth/password-recovery/inputs/reset-password.input';
import { Request } from 'express';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly telegramService: TelegramService,
  ) {}

  public async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        notificationSettings: true,
      },
    });

    if (!user) {
      throw new NotAcceptableException('Пользователь не найден');
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET,
    );

    const metadata = getSessionMetadata(req, userAgent);

    if (!IS_DEV_ENV) {
      await this.mailService.sendPasswordResetToken(
        user.email,
        resetToken.token,
        metadata,
      );
    }

    if (
      resetToken.user.notificationSettings.telegramNotifications &&
      resetToken.user.telegramId
    ) {
      await this.telegramService.sendPasswordResetToken(
        resetToken.user.telegramId,
        resetToken.token,
        metadata,
      );
    }

    return true;
  }

  public async newPassword(input: NewPasswordInput) {
    const { password, token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Токен не найден');
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Токен истёк');
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        password: await hash(password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }
}
