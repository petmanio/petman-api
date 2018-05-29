import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { UserMiddleware } from './user.middleware';
import { AuthGuard } from './auth.guard';
import { City } from './city.entity';
import { CityRepository } from './city.repository';
import { State } from './state.entity';
import { StateRepository } from './state.repository';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';
import { Address } from './address.entity';
import { AddressRepository } from './address.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, CityRepository, State, StateRepository, Country, CountryRepository, Address, AddressRepository]),
    UserModule,
  ],
  providers: [UserMiddleware, AuthGuard],
  controllers: [],
  exports: [AuthGuard],
})
export class SharedModule {
}
