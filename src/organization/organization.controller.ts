import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { OrganizationListDto } from '@petmanio/common/dto/organization/organization-list.dto';
import { OrganizationListQueryDto } from '@petmanio/common/dto/organization/organization-list-query.dto';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';

import { User } from '../user/user.entity';

import { OrganizationService } from './organization.service';

@ApiBearerAuth()
@ApiUseTags('Organizations')
@Controller('organizations')
export class OrganizationController {

  private logger = new Logger(OrganizationController.name);

  constructor(private organizationService: OrganizationService) {
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'services', type: Number, isArray: true, required: false, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: OrganizationListDto })
  @Get('/')
  async list(@Query() query: OrganizationListQueryDto, @SelectedUserParam() selectedUser: User): Promise<OrganizationListDto> {
    const listQueryDto = plainToClass(OrganizationListQueryDto, query);
    const organizations = await this.organizationService.getList(listQueryDto.offset, listQueryDto.limit, listQueryDto.services);
    return plainToClass(OrganizationListDto, organizations, { groups: ['api'] });
  }
}
