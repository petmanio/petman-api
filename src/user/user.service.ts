import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FbUserDto } from '../../common/dto/user/fb-user.dto';

import { AuthProvider } from '../auth/auth-provider.entity';

import { User } from './user.entity';
import { UserData } from './user-data.entity';
import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import { UserDataRepository } from './user-data.repository';
import { Gender } from '../../common/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDataRepository)
    private readonly userDataRepository: Repository<UserData>,
  ) {
  }

  async create(fbUser: FbUserDto, authProvider: AuthProvider): Promise<User> {
    const userData = this.userDataRepository.create();
    userData.gender = (fbUser.gender && fbUser.gender.toLocaleUpperCase()) as Gender;
    userData.firstName = fbUser.first_name;
    userData.lastName = fbUser.last_name;

    await this.userDataRepository.save(userData);

    const user = await this.userRepository.create();
    user.email = fbUser.email;
    user.userData = userData;
    user.authProviders = [authProvider];

    await this.userRepository.save(user);

    return user;
  }
}
