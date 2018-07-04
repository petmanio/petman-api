import { EntityRepository, Repository } from 'typeorm';

import { PinDto } from '@petman/common';

import { Poi } from './poi.entity';

@EntityRepository(Poi)
export class PoiRepository extends Repository<Poi> {
  private static categoriesFindOptions = (categories: number[], alias: string) => {
    return (categories && categories.length)
      ? [`${alias}.deleted IS NULL AND ${alias}.primaryCategory IN (:...ids)`, { ids: categories }]
      : [`${alias}.deleted IS NULL`];
  }

  async getList(offset: number, limit: number, categories: number[]): Promise<[Poi[], number]> {
    return await this.createQueryBuilder('poi')
      .skip(offset)
      .limit(limit)
      .orderBy('poi.updated', 'DESC')
      .andWhere(...PoiRepository.categoriesFindOptions(categories, 'poi'))
      .leftJoinAndSelect('poi.primaryCategory', 'primaryCategory')
      .leftJoinAndSelect('poi.address', 'address')
      .leftJoinAndSelect('address.city', 'city')
      .leftJoinAndSelect('address.state', 'state')
      .leftJoinAndSelect('address.country', 'country')
      .getManyAndCount();
  }

  async getPins(categories: number[]): Promise<PinDto[]> {
    const pois = await this.createQueryBuilder('poi')
      .andWhere(...PoiRepository.categoriesFindOptions(categories, 'poi'))
      .innerJoinAndSelect('poi.address', 'address', 'address.point NOTNULL AND address.deleted IS NULL')
      .select([
        'poi.name', 'poi.description',
        'address.line1', 'address.line2', 'address.line3', 'address.point',
      ])
      .getMany();

    return [...pois];
  }
}
