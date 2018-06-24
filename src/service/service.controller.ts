import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ListQueryRequestDto, ServiceListResponseDto } from '@petman/common';

import { ServiceService } from './service.service';

@ApiBearerAuth()
@ApiUseTags('Services')
@Controller('api/services')
export class ServiceController {

  private logger = new Logger(ServiceController.name);

  constructor(private serviceService: ServiceService) {
  }

  @ApiOperation({ title: 'List' })
  @ApiResponse({ status: 200, type: ServiceListResponseDto })
  @Get('/')
  async list(@Query() query: ListQueryRequestDto): Promise<ServiceListResponseDto> {
    const services = await this.serviceService.getList(query.offset, query.limit);
    return plainToClass(ServiceListResponseDto, services, { groups: ['api'] });
  }
}
