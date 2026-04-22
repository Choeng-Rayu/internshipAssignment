import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const email = emails[0]?.value;

    let user: any = await this.usersService.findByGoogleId(id);

    if (!user && email) {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        user = await this.usersService.linkGoogleAccount(existingUser.id, id);
      } else {
        user = await this.usersService.create({
          email,
          googleOauthId: id,
          role: 'USER',
        });
      }
    }

    if (!user) {
      return done(new UnauthorizedException('Unable to authenticate'), false);
    }

    const token = this.authService.generateToken(user);
    done(null, { user, token });
  }
}
