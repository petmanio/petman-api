import { EntityRepository, Repository } from 'typeorm';

import { Service } from './service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getList(offset: number, limit: number): Promise<[Service[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
    });
  }
}
