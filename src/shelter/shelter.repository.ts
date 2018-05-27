import { EntityRepository, Repository } from 'typeorm';

import { Shelter } from './shelter.entity';

@EntityRepository(Shelter)
export class ShelterRepository extends Repository<Shelter> {
}
