import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { Organization } from './organization.entity';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Branch } from './branch.entity';
import { BranchRepository } from './branch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationRepository, Branch, BranchRepository]), SharedModule],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {
}
