import { EntityRepository, Repository } from 'typeorm';

import { User } from '../user/user.entity';

import { Shelter } from './shelter.entity';

@EntityRepository(Shelter)
export class ShelterRepository extends Repository<Shelter> {
  async createAndSave(description: string, price: number, images: string[], user: User): Promise<Shelter> {
    const shelter = this.create();
    shelter.description = description;
    shelter.price = price;
    shelter.images = images;
    shelter.user = user;

    await this.save(shelter);

    return shelter;
  }

  async findById(id: number): Promise<Shelter> {
    return await this.findOne({ id, deleted: null, relations: ['user', 'user.userData', 'user.authProviders'] });
  }
}
