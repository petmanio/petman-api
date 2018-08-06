import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { UserMiddleware } from './user.middleware';
import { AuthGuard } from './auth.guard';
import { SharedService } from './shared.service';
import { City } from './city.entity';
import { CityRepository } from './city.repository';
import { State } from './state.entity';
import { StateRepository } from './state.repository';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';
import { Address } from './address.entity';
import { AddressRepository } from './address.repository';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      City,
      CityRepository,
      State,
      StateRepository,
      Country,
      CountryRepository,
      Address,
      AddressRepository,
      Category,
      CategoryRepository,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [UserMiddleware, AuthGuard, SharedService],
  controllers: [],
  exports: [AuthGuard, SharedService],
})
export class SharedModule {}
