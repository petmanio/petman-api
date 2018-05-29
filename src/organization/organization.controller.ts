import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { PinDto } from '@petmanio/common/dto/shared/pin.dto';
import { OrganizationListDto } from '@petmanio/common/dto/organization/organization-list.dto';
import { OrganizationListQueryDto } from '@petmanio/common/dto/organization/organization-list-query.dto';

import { OrganizationService } from './organization.service';

@ApiBearerAuth()
@ApiUseTags('Organizations')
@Controller('api/organizations')
export class OrganizationController {

  private logger = new Logger(OrganizationController.name);

  constructor(private organizationService: OrganizationService) {
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'services', type: Number, isArray: true, required: false, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: OrganizationListDto })
  @Get('/')
  async list(@Query() query: OrganizationListQueryDto): Promise<OrganizationListDto> {
    const listQueryDto = plainToClass(OrganizationListQueryDto, query);
    const organizations = await this.organizationService.getList(listQueryDto.offset, listQueryDto.limit, listQueryDto.services);
    return plainToClass(OrganizationListDto, organizations, { groups: ['api'] });
  }

  @ApiOperation({ title: 'Pins' })
  @ApiImplicitQuery({ name: 'services', required: false, isArray: true, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: PinDto, isArray: true })
  @Get('pins')
  async pins(@Query('services') services: number[]): Promise<PinDto[]> {
    if (!services) {
      services = [];
    }
    services = typeof services === 'string' ? [services] : services;

    const pins = await this.organizationService.getPins(services);
    return plainToClass(PinDto, pins);
  }
}
