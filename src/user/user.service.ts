import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FbUserDto } from '@petmanio/common/dto/user/fb-user.dto';

import { AuthProvider } from '../auth/auth-provider.entity';

import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDataRepository } from './user-data.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserDataRepository)
    private userDataRepository: UserDataRepository,
  ) {
  }

  async create(fbUser: FbUserDto, authProvider: AuthProvider): Promise<User> {
    const userData = await this.userDataRepository.createAndSave(fbUser);
    return await this.userRepository.createAndSave(fbUser.email, userData, authProvider);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }
}
