import * as config from 'config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Facebook } from 'fb';

import { JwtPayload } from '@petmanio/common/dist/interface';
import { FbUserDto } from '@petmanio/common/dist/dto/user/fb-user.dto';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { AuthProviderRepository } from './auth-provider.repository';
import { LoginFacebookResponseDto } from '@petmanio/common/dist/dto/auth/login-facebook-response.dto';

const fb = new Facebook({
  appId: config.get('fb.appId'),
  appSecret: config.get('fb.appSecret'),
});

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthProviderRepository)
    private authProviderRepository: AuthProviderRepository,
    private userService: UserService,
  ) {
  }

  async createToken(user: User): Promise<LoginFacebookResponseDto> {
    const token = sign({ id: user.id } , config.get('secret'), { expiresIn: config.get('tokenExpireIn') });
    return { token };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return this.userService.findById(payload.id);
  }

  async getUserFbDataByAccessToken(accessToken: string): Promise<FbUserDto> {
    fb.setAccessToken(accessToken);
    const res: FbUserDto | any = await fb.api('me', { fields: config.get('fb.scope') });
    if (res.error) {
      throw res.error;
    }
    return res;
  }

  async findOrCreateFbUser(fbUser: FbUserDto, accessToken: string): Promise<User> {
    const auth = await this.authProviderRepository.findOneByExternalId(fbUser.id.toString());

    if (auth) {
      auth.accessToken = accessToken;
      await this.authProviderRepository.save(auth);
      return auth.user;
    }

    const authProvider = await this.authProviderRepository.createAndSave(fbUser.id.toString(), accessToken);

    return await this.userService.create(fbUser, authProvider);
  }
}
