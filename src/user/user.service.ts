import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { merge } from 'lodash';

import { FbUserDto } from '@petman/common';

import { AuthProvider } from '../auth/auth-provider.entity';

import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDataRepository } from './user-data.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(UserDataRepository)
    private userDataRepository: UserDataRepository,
  ) {}

  async create(fbUser: FbUserDto, authProvider: AuthProvider): Promise<User> {
    const userData = await this.userDataRepository.createAndSave(fbUser);
    return await this.userRepository.createAndSave(
      fbUser.email,
      userData,
      authProvider,
    );
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async findByIdWithUserData(id: number): Promise<User> {
    return this.userRepository.findByIdWithUserData(id);
  }

  async update(
    user: User,
    firstName: string,
    lastName: string,
    facebookUrl: string,
    phoneNumber: string,
  ) {
    user.userData = merge(user.userData, {
      firstName,
      lastName,
      facebookUrl,
      phoneNumber,
    });
    await this.userDataRepository.save(user.userData);
    return user;
  }

  async setSitter(id: number, isSitter) {
    await this.userRepository.update({ id }, { isSitter });
  }

  async setWalker(id: number, isWalker) {
    await this.userRepository.update({ id }, { isWalker });
  }
}
