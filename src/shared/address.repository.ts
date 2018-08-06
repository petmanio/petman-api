import { EntityRepository, Repository } from 'typeorm';

import { AddressRequestDto } from '@petman/common/dist/dto/shared/address-request.dto';

import { Address } from './address.entity';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {
  async createAndSave(addressRequest: AddressRequestDto): Promise<Address> {
    const address = this.create();
    address.line1 = addressRequest.line1;
    address.line2 = addressRequest.line2;
    address.line3 = addressRequest.line3;
    address.point = addressRequest.point;
    // address.zipCode = addressRequest.zipCode;

    // FIXME: find right way for passing entityId
    address.city = addressRequest.cityId as any;
    address.state = addressRequest.stateId as any;
    address.country = addressRequest.countryId as any;

    await this.save(address);

    return address;
  }
}
