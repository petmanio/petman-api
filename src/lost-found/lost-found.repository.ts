import { EntityRepository, Repository } from 'typeorm';

import { LostFoundType } from '@petmanio/common/enum';

import { User } from '../user/user.entity';

import { LostFound } from './lost-found.entity';

@EntityRepository(LostFound)
export class LostFoundRepository extends Repository<LostFound> {
  async createAndSave(type: LostFoundType, description: string, images: string[], user: User): Promise<LostFound> {
    const lostFound = this.create();
    lostFound.type = type;
    lostFound.description = description;
    lostFound.images = images;
    lostFound.user = user;

    await this.save(lostFound);

    return lostFound;
  }

  async findById(id: number): Promise<LostFound> {
    return await this.findOne({ id, deleted: null }, { relations: ['user', 'user.userData', 'user.authProviders'] });
  }

  async getList(offset: number, limit: number): Promise<[LostFound[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
