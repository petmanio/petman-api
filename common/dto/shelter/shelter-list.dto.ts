import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { dtoGetter } from '../../lib';
import { ShelterDto } from './shelter.dto';

export class ShelterListDto {
  @ApiModelProperty({ type: Number })
  readonly total;

  @ApiModelProperty({ type: ShelterDto, isArray: true })
  @Type(dtoGetter(ShelterDto))
  readonly list: ShelterDto[];
}
