import { EntityRepository, Repository } from 'typeorm';

import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getList(offset: number, limit: number): Promise<[Category[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
    });
  }
}
