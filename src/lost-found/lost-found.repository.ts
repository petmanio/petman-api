import { EntityRepository, FindConditions, In, Repository } from 'typeorm';

import { LostFoundListQueryRequestDto, LostFoundRequestDto, LostFoundType } from '@petman/common';

import { User } from '../user/user.entity';

import { LostFound } from './lost-found.entity';
import { Adopt } from '../adopt/adopt.entity';

@EntityRepository(LostFound)
export class LostFoundRepository extends Repository<LostFound> {
  async createAndSave(body: LostFoundRequestDto, user: User): Promise<LostFound> {
    const lostFound = this.create();
    lostFound.description = body.description;
    lostFound.applicationType = body.applicationType;
    lostFound.images = body.images;
    lostFound.gender = body.gender;
    lostFound.type = body.type;
    lostFound.size = body.size;
    lostFound.age = body.age;

    lostFound.user = user;

    await this.save(lostFound);

    return lostFound;
  }

  async findById(id: number): Promise<LostFound> {
    return await this.findOne({ id, deleted: null }, { relations: ['user', 'user.userData', 'user.authProviders'] });
  }

  async findByUserId(userId: number): Promise<LostFound[]> {
    return await this.find({
      where: { deleted: null, user: { id: userId } },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }

  async getList(query: LostFoundListQueryRequestDto): Promise<[LostFound[], number]> {
    const filterQuery: FindConditions<LostFound> = {};
    if (query.applicationType) {
      filterQuery.applicationType = query.applicationType;
    }
    if (query.type && query.type.length) {
      filterQuery.type = In(query.type);
    }
    if (query.gender && query.gender.length) {
      filterQuery.gender = In(query.gender);
    }
    if (query.age && query.age.length) {
      filterQuery.age = In(query.age);
    }
    if (query.size && query.size.length) {
      filterQuery.size = In(query.size);
    }

    return await this.findAndCount({
      where: { deleted: null, ...filterQuery },
      skip: query.offset,
      take: query.limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
