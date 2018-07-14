import { EntityRepository, FindConditions, In, Repository } from 'typeorm';

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
    const filterQuery: FindConditions<Poi> = {};
    if (categories && categories.length) {
      filterQuery.primaryCategory = In(categories);
    }
    return await this.findAndCount({
      where: { deleted: null, ...filterQuery },
      skip: offset,
      take: limit,
      order: { updated: 'DESC' },
      relations: ['primaryCategory', 'address', 'address.city', 'address.state', 'address.country'],
    });
  }

  async getPins(categories: number[]): Promise<PinDto[]> {
    // FIXME: TS2556: Expected 1-2 arguments, but got 0 or more.
    const findOptions: any = PoiRepository.categoriesFindOptions(categories, 'poi');
    const pois = await this.createQueryBuilder('poi')
      .andWhere(findOptions[0], findOptions[1])
      .innerJoinAndSelect('poi.address', 'address', 'address.point NOTNULL')
      .innerJoinAndSelect('address.city', 'city')
      .innerJoinAndSelect('address.state', 'state')
      .innerJoinAndSelect('address.country', 'country')
      .innerJoinAndSelect('poi.primaryCategory', 'primaryCategory')
      .select([
        'poi.id', 'poi.name', 'poi.description', 'poi.avatar',
        'primaryCategory.name', 'primaryCategory.label',
        'country.name', 'state.name', 'city.name', 'address.line1', 'address.line2', 'address.line3', 'address.point',
      ])
      .getMany();

    // FIXME: TS2352: Type 'Poi[]' cannot be converted to type 'PinDto[]'.
    return [...pois as any];
  }
}
