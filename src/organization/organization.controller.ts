import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ListQueryDto } from '@petmanio/common/dto/shared/list-query.dto';
import { OrganizationListDto } from '@petmanio/common/dto/organization/organization-list.dto';

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
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiResponse({ status: 200, type: OrganizationListDto })
  @Get('/')
  async list(@Query() query: ListQueryDto, @SelectedUserParam() selectedUser: User): Promise<OrganizationListDto> {
    const organizations = await this.organizationService.getList(query.offset, query.limit);
    return plainToClass(OrganizationListDto, organizations, { groups: ['api'] });
  }
}
