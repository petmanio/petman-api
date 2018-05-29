import { EntityRepository, Repository } from 'typeorm';

import { Organization } from './organization.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  private servicesFindOptions = (services: number[], alias: string) => services ? [`${alias}.id IN (:...ids)`, { ids: services }] : [];

  async getList(offset: number, limit: number, services: number[]): Promise<[Organization[], number]> {
    return await this.createQueryBuilder('organization')
      .where({ deleted: null })
      .skip(offset)
      .limit(limit)
      //  FIXME: column reference "updated" is ambiguous
      // .orderBy('updated', 'DESC')
      .leftJoinAndSelect('organization.services', 'services', ...this.servicesFindOptions(services, 'services'))
      .leftJoinAndSelect('organization.address', 'address')
      .leftJoinAndSelect('address.city', 'city')
      .leftJoinAndSelect('address.state', 'state')
      .leftJoinAndSelect('address.country', 'country')
      .leftJoinAndSelect('organization.branches', 'branches')
      .leftJoinAndSelect('branches.services', 'branchesServices', ...this.servicesFindOptions(services, 'branchesServices'))
      .leftJoinAndSelect('branches.address', 'branchesAddress')
      .leftJoinAndSelect('branchesAddress.city', 'branchesAddressCity')
      .leftJoinAndSelect('branchesAddress.state', 'branchesAddressState')
      .leftJoinAndSelect('branchesAddress.country', 'branchesAddressCountry')
      .getManyAndCount();
  }
}
