import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { Walker } from './walker.entity';
import { WalkerRepository } from './walker.repository';
import { CommonListDto } from '../../common/dto/shared/common-list.dto';
import { WalkerDto } from '../../common/dto/walker/walker.dto';

@Injectable()
export class WalkerService {
  constructor(
    @InjectRepository(WalkerRepository)
    private walkerRepository: WalkerRepository,
  ) {
  }

  async create(description: string, price: number, user: User): Promise<Walker> {
    return await this.walkerRepository.createAndSave(description, price, user);
  }

  async findById(id: number): Promise<Walker> {
    return await this.walkerRepository.findById(id);
  }

  async update(walker: Walker, description: string, price: number): Promise<Walker> {
    walker.price = price;
    walker.description = description;
    await this.walkerRepository.save(walker);
    return walker;
  }

  async delete(walker: Walker) {
    walker.deleted = new Date();
    await this.walkerRepository.save(walker);
  }

  async getList(offset: number, limit: number): Promise<CommonListDto<WalkerDto>> {
    const data = await this.walkerRepository.getList(offset, limit);

    return { limit: data[1], list: data[0] }
  }
}
