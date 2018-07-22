import { EntityRepository, Repository } from 'typeorm';

import { User } from '../user/user.entity';

import { Adopt } from './adopt.entity';

@EntityRepository(Adopt)
export class AdoptRepository extends Repository<Adopt> {
  async createAndSave(description: string, images: string[], user: User): Promise<Adopt> {
    const adopt = this.create();
    adopt.description = description;
    adopt.images = images;
    adopt.user = user;

    await this.save(adopt);

    return adopt;
  }

  async findById(id: number): Promise<Adopt> {
    return await this.findOne({ id, deleted: null }, { relations: ['user', 'user.userData', 'user.authProviders'] });
  }

  async getList(offset: number, limit: number): Promise<[Adopt[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
