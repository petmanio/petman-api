import { map } from 'lodash';
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { WalkerDto } from '@petmanio/common/dist/dto/walker/walker.dto';
import { WalkerCreateDto } from '@petmanio/common/dist/dto/walker/walker-create.dto';
import { ListQueryDto } from '@petmanio/common/dist/dto/shared/list-query.dto';
import { WalkerListDto } from '@petmanio/common/dist/dto/walker/walker-list.dto';

import { SelectedUserParam } from '../shared/selected-user-param.decorator';
import { AuthGuard } from '../shared/auth.guard';

import { User } from '../user/user.entity';

import { WalkerService } from './walker.service';
import { WalkerParam } from './walker-param.decorator';
import { WalkerExistsGuard } from './walker-exists.guard';
import { WalkerOwnerGuard } from './walker-owner.guard';
import { Walker } from './walker.entity';

@ApiBearerAuth()
@ApiUseTags('Walkers')
@Controller('walkers')
export class WalkerController {

  private logger = new Logger(WalkerController.name);

  constructor(private walkerService: WalkerService) {
  }

  @ApiOperation({ title: 'Create' })
  @ApiResponse({ status: 200, type: WalkerDto })
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: WalkerCreateDto, @SelectedUserParam() selectedUser: User): Promise<WalkerDto> {
    const walker = await this.walkerService.create(body.description, body.price, selectedUser);
    const walkerDto = plainToClass(WalkerDto, walker, { groups: ['api'] });
    walkerDto.isOwner = true;

    return walkerDto;
  }

  @ApiOperation({ title: 'Get' })
  @ApiResponse({ status: 200, type: WalkerDto })
  @UseGuards(WalkerExistsGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @SelectedUserParam() selectedUser: User, @WalkerParam() walker: WalkerParam): Promise<WalkerDto> {
    const walkerDto = plainToClass(WalkerDto, walker, { groups: ['api'] });
    walkerDto.isOwner = walkerDto.user.id === (selectedUser && selectedUser.id);

    return walkerDto;
  }

  @ApiOperation({ title: 'Update' })
  @ApiResponse({ status: 200, type: WalkerDto })
  @UseGuards(AuthGuard, WalkerExistsGuard, WalkerOwnerGuard)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: WalkerDto,
    @WalkerParam() walker: Walker,
  ): Promise<WalkerDto> {
    await this.walkerService.update(walker, body.description, body.price);
    const walkerDto = plainToClass(WalkerDto, walker, { groups: ['api'] });
    walkerDto.isOwner = true;

    return walkerDto;
  }

  @ApiOperation({ title: 'Delete' })
  @ApiResponse({ status: 204 })
  @UseGuards(AuthGuard, WalkerExistsGuard, WalkerOwnerGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @WalkerParam() walker: Walker, @Res() res): Promise<Response> {

    await this.walkerService.delete(walker);
    return res.status(HttpStatus.NO_CONTENT).end();
  }

  @ApiOperation({ title: 'List' })
  @ApiImplicitQuery({ name: 'limit', type: Number })
  @ApiImplicitQuery({ name: 'offset', type: Number })
  @ApiResponse({ status: 200, type: WalkerListDto })
  @Get('/')
  async list(@Query() query: ListQueryDto, @SelectedUserParam() selectedUser: User): Promise<WalkerListDto> {
    const walkers = await this.walkerService.getList(query.offset, query.limit);
    const walkersDto = plainToClass(WalkerListDto, walkers, { groups: ['api'] });

    walkersDto.list = map(walkersDto.list, (walker) => {
      walker.isOwner = walker.userId === (selectedUser && selectedUser.id);
      return walker;
    });

    return walkersDto;

  }
}
