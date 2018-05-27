import { EntityRepository, Repository } from 'typeorm';

import { AuthProvider } from '../auth/auth-provider.entity';

import { User } from './user.entity';
import { UserData } from './user-data.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(email: string, userData: UserData, authProvider: AuthProvider): Promise<User> {
    const user = this.create();
    user.email = email;
    user.userData = userData;
    user.authProviders = [authProvider];

    await this.save(user);

    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ id, deleted: null });
  }
}
