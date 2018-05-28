import { EntityRepository, Repository } from 'typeorm';

import { User } from '../user/user.entity';

import { Walker } from './walker.entity';

@EntityRepository(Walker)
export class WalkerRepository extends Repository<Walker> {
  async createAndSave(description: string, price: number, user: User): Promise<Walker> {
    const walker = this.create();
    walker.description = description;
    walker.price = price;
    walker.user = user;

    await this.save(walker);

    return walker;
  }

  async findById(id: number): Promise<Walker> {
    return await this.findOne({ id, deleted: null }, { relations: ['user', 'user.userData', 'user.authProviders'] });
  }

  async getList(offset: number, limit: number): Promise<[Walker[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
