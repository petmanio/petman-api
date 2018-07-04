import { EntityRepository, Repository } from 'typeorm';

import { PinDto } from '@petman/common';

import { Organization } from './organization.entity';
import { Branch } from './branch.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  private servicesFindOptions = (services: number[], alias: string) => services ? [`${alias}.id IN (:...ids)`, { ids: services }] : [];

  async getList(offset: number, limit: number, services: number[]): Promise<[Organization[], number]> {
    return await this.createQueryBuilder('organization')
      .skip(offset)
      .limit(limit)
      .orderBy('organization.updated', 'DESC')
      .andWhere('organization.deleted IS NULL')
      .innerJoinAndSelect('organization.services', 'services', ...this.servicesFindOptions(services, 'services'))
      .leftJoinAndSelect('organization.address', 'address')
      .leftJoinAndSelect('address.city', 'city')
      .leftJoinAndSelect('address.state', 'state')
      .leftJoinAndSelect('address.country', 'country')
      .leftJoinAndSelect('organization.branches', 'branches', 'branches.deleted IS NULL')
      .leftJoinAndSelect('branches.services', 'branchesServices', ...this.servicesFindOptions(services, 'branchesServices'))
      .leftJoinAndSelect('branches.address', 'branchesAddress')
      .leftJoinAndSelect('branchesAddress.city', 'branchesAddressCity')
      .leftJoinAndSelect('branchesAddress.state', 'branchesAddressState')
      .leftJoinAndSelect('branchesAddress.country', 'branchesAddressCountry')
      .getManyAndCount();
  }

  async getPins(services: number[]): Promise<PinDto[]> {
    const organizations = await this.createQueryBuilder('organization')
      .innerJoin('organization.services', 'services', ...this.servicesFindOptions(services, 'services'))
      .innerJoinAndSelect('organization.address', 'address', 'address.point NOTNULL AND address.deleted IS NULL')
      .select([
        'organization.title', 'organization.description',
        'address.line1', 'address.line2', 'address.line3', 'address.point',
      ])
      .getMany();

    const branches = await this.manager.createQueryBuilder(Branch, 'branch')
      .innerJoin('branch.services', 'services', ...this.servicesFindOptions(services, 'services'))
      .innerJoinAndSelect('branch.address', 'address', 'address.point NOTNULL AND address.deleted IS NULL')
      .select([
        'branch.title', 'branch.description',
        'address.line1', 'address.line2', 'address.line3', 'address.point',
      ])
      .getMany();

    return [...organizations, ...branches];
  }
}
