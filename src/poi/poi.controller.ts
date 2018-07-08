import { Controller, Delete, Get, HttpStatus, Logger, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import {
  CategoryListResponseDto,
  ListQueryRequestDto,
  PinDto,
  PoiListQueryRequestDto,
  PoiListResponseDto,
  PoiPinsQueryRequestDto,
} from '@petman/common';

import { SharedService } from '../shared/shared.service';
import { PoiService } from './poi.service';

@ApiBearerAuth()
@ApiUseTags('Pois')
@Controller('api/pois')
export class PoiController {

  private logger = new Logger(PoiController.name);

  constructor(private sharedService: SharedService, private poiService: PoiService) {
  }

  @ApiOperation({ title: 'Categories' })
  @ApiResponse({ status: 200, type: CategoryListResponseDto })
  @Get('categories')
  async categories(@Query() query: ListQueryRequestDto): Promise<CategoryListResponseDto> {
    const categoryListResponseDto = await this.sharedService.getCategories(query.offset, query.limit);
    return plainToClass(CategoryListResponseDto, categoryListResponseDto, { groups: ['petman-api'] });
  }

  @ApiOperation({ title: 'Pins' })
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'primaryCategories', type: Number, isArray: true, required: false, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: PinDto, isArray: true })
  @Get('pins')
  async pins(@Query() query: PoiPinsQueryRequestDto): Promise<PinDto[]> {
    const listQueryDto = plainToClass(PoiPinsQueryRequestDto, query);
    const pins = await this.poiService.getPins(listQueryDto.primaryCategories);
    return plainToClass(PinDto, pins, { groups: ['petman-api'] });
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
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'primaryCategories', type: Number, isArray: true, required: false, collectionFormat: 'multi' })
  @ApiResponse({ status: 200, type: PoiListResponseDto })
  @Get('/')
  async list(@Query() query: PoiListQueryRequestDto): Promise<PoiListResponseDto> {
    const listQueryDto = plainToClass(PoiListQueryRequestDto, query);
    const pois = await this.poiService.getList(listQueryDto.offset, listQueryDto.limit, listQueryDto.primaryCategories);
    return plainToClass(PoiListResponseDto, pois, { groups: ['petman-api'] });
  }
}
