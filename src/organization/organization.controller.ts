import { Controller, Delete, Get, HttpStatus, Logger, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { OrganizationListQueryRequestDto, OrganizationListResponseDto, PinDto } from '@petman/common';

import { OrganizationService } from './organization.service';

@ApiBearerAuth()
@ApiUseTags('Organizations')
@Controller('api/organizations')
export class OrganizationController {

  private logger = new Logger(OrganizationController.name);

  constructor(private organizationService: OrganizationService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: HttpStatus.NOT_IMPLEMENTED })
  @Post('/')
  async create(@Res() res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).end();
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: HttpStatus.NOT_IMPLEMENTED })
  @Get(':id')
  async findById(@Res() res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).end();
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: HttpStatus.NOT_IMPLEMENTED })
  @Put(':id')
  async updateById(@Res() res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).end();
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: HttpStatus.NOT_IMPLEMENTED })
  @Delete(':id')
  async deleteById(@Res() res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'services', type: Number, isArray: true, required: false, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: OrganizationListResponseDto })
  @Get('/')
  async list(@Query() query: OrganizationListQueryRequestDto): Promise<OrganizationListResponseDto> {
    const listQueryDto = plainToClass(OrganizationListQueryRequestDto, query);
    const organizations = await this.organizationService.getList(listQueryDto.offset, listQueryDto.limit, listQueryDto.services);
    return plainToClass(OrganizationListResponseDto, organizations, { groups: ['petman-api'] });
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
