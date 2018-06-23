import * as config from 'config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '@petman/common';

import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('secret'),
    });
  }

  async validate(payload: JwtPayload, done: (exeption: HttpException, result: User) => void) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException(), null);
    }
    done(null, user);
  }
}
