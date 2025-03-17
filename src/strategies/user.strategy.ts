import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenInterface } from 'src/auth/interface/token.interface';

@Injectable()
export class UsersAuthStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(token: TokenInterface) {
    try {
      return token;
    } catch (e) {
      throw new HttpException('Unauthorized', 401);
    }
  }
}
