import * as config from 'config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Facebook } from 'fb';
import { Repository } from 'typeorm';

import { JwtPayload } from '../../common/interface';
import { FbUserDto } from '../../common/dto/user/fb-user.dto';
import { AuthProviderType } from '../../common/enum';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { AuthProviderRepository } from './auth-provider.repository';
import { AuthProvider } from './auth-provider.entity';
import { LoginFacebookResponseDto } from '../../common/dto/auth/login-facebook-response.dto';

const fb = new Facebook({
  appId: config.get('fb.appId'),
  appSecret: config.get('fb.appSecret'),
});

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthProviderRepository)
    private authProviderRepository: Repository<AuthProvider>,
    private userService: UserService,
  ) {
  }

  async createToken(user: User): Promise<LoginFacebookResponseDto> {
    const token = sign({ id: user.id } , config.get('secret'), { expiresIn: config.get('tokenExpireIn') });
    return { token };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    // return this;
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
    const auth = await this.authProviderRepository.findOne({
      where: {
        externalId: fbUser.id,
      },
      relations: ['user'],
    });

    if (auth) {
      auth.accessToken = accessToken;
      await this.authProviderRepository.save(auth);
      return auth.user;
    }

    const authProvider = this.authProviderRepository.create();
    authProvider.type = AuthProviderType.FACEBOOK;
    authProvider.externalId = fbUser.id.toString();
    authProvider.accessToken = accessToken;

    await this.authProviderRepository.save(authProvider);

    return await this.userService.create(fbUser, authProvider);
  }
}
