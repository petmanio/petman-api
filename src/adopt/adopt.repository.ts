import { EntityRepository, Repository, FindConditions, In } from 'typeorm';

import { User } from '../user/user.entity';

import { Adopt } from './adopt.entity';
import { AdoptRequestDto, AdoptListQueryRequestDto } from '@petman/common';

@EntityRepository(Adopt)
export class AdoptRepository extends Repository<Adopt> {
  async createAndSave(body: AdoptRequestDto, user: User): Promise<Adopt> {
    const adopt = this.create();
    adopt.description = body.description;
    adopt.images = body.images;
    adopt.gender = body.gender;
    adopt.type = body.type;
    adopt.size = body.size;
    adopt.age = body.age;

    adopt.user = user;

    await this.save(adopt);

    return adopt;
  }

  async findById(id: number): Promise<Adopt> {
    return await this.findOne(
      { id, deleted: null },
      {
        relations: ['user', 'user.userData', 'user.authProviders'],
      },
    );
  }

  async findByUserId(userId: number): Promise<Adopt[]> {
    return await this.find({
      where: { deleted: null, user: { id: userId } },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }

  async getList(query: AdoptListQueryRequestDto): Promise<[Adopt[], number]> {
    const filterQuery: FindConditions<Adopt> = {};
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
