import { EntityRepository, Repository } from 'typeorm';

import { Organization } from './organization.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  async getList(offset: number, limit: number): Promise<[Organization[], number]> {
    return await this.findAndCount({
      where: { deleted: null },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['user', 'user.userData', 'user.authProviders'],
    });
  }
}
