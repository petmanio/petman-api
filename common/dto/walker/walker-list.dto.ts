import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { dtoGetter } from '../../lib';
import { WalkerDto } from './walker.dto';

export class WalkerListDto {
  @ApiModelProperty({ type: Number })
  readonly total;

  @ApiModelProperty({ type: WalkerDto, isArray: true })
  @Type(dtoGetter(WalkerDto))
  readonly list: WalkerDto[];
}
