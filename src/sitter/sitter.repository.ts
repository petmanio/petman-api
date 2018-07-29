import { EntityRepository, Repository } from 'typeorm';

import { User } from '../user/user.entity';

import { Sitter } from './sitter.entity';

@EntityRepository(Sitter)
export class SitterRepository extends Repository<Sitter> {
  async createAndSave(description: string, price: number, images: string[], user: User): Promise<Sitter> {
    const sitter = this.create();
    sitter.description = description;
    sitter.price = price;
    sitter.images = images;
    sitter.user = user;

    await this.save(sitter);

    return sitter;
  }

  async findById(id: number): Promise<Sitter> {
    return await this.findOne({ id, deleted: null }, { relations: ['user', 'user.userData', 'user.authProviders'] });
  }

  async getList(offset: number, limit: number): Promise<[Sitter[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
