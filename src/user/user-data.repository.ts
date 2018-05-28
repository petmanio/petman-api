import { EntityRepository, Repository } from 'typeorm';

import { FbUserDto } from './@petmanio/common/dist/dto/user/fb-user.dto';
import { Gender } from '@petmanio/common/dist/enum';

import { UserData } from './user-data.entity';

@EntityRepository(UserData)
export class UserDataRepository extends Repository<UserData> {
  async createAndSave(fbUser: FbUserDto): Promise<UserData> {
    const userData = this.create();
    userData.gender = (fbUser.gender && fbUser.gender.toLocaleUpperCase()) as Gender;
    userData.firstName = fbUser.first_name;
    userData.lastName = fbUser.last_name;

    await this.save(userData);
    return userData;
  }
}
