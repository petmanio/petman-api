import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ListQueryDto } from '@petmanio/common/dto/shared/list-query.dto';
import { ServiceListDto } from '@petmanio/common/dto/service/service-list.dto';

import { ServiceService } from './service.service';

@ApiBearerAuth()
@ApiUseTags('Services')
@Controller('services')
export class ServiceController {

  private logger = new Logger(ServiceController.name);

  constructor(private serviceService: ServiceService) {
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiResponse({ status: 200, type: ServiceListDto })
  @Get('/')
  async list(@Query() query: ListQueryDto): Promise<ServiceListDto> {
    const services = await this.serviceService.getList(query.offset, query.limit);
    return plainToClass(ServiceListDto, services, { groups: ['api'] });
  }
}
