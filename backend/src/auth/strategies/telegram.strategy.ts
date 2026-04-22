import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import * as crypto from 'crypto';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { id, first_name, last_name, username, photo_url, auth_date, hash } =
      req.query;

    if (!id || !hash) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new UnauthorizedException('Telegram bot token not configured');
    }

    const dataCheckString = Object.keys(req.query)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${req.query[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Invalid Telegram auth hash');
    }

    const telegramId = id.toString();
    const name = [first_name, last_name].filter(Boolean).join(' ');

    let user: any = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      user = await this.usersService.create({
        telegramOauthId: telegramId,
        telegramUsername: username,
        telegramName: name,
        role: 'USER',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to authenticate');
    }

    const token = this.authService.generateToken(user);
    return { user, token };
  }
}
