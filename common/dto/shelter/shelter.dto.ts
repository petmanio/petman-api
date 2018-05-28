import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

import { dtoGetter } from '../../lib';
import { UserDto } from '../user/user.dto';

export class ShelterDto {
  @ApiModelProperty({ type: Number })
  id: number;

  @ApiModelProperty({ type: String })
  text: string;

  @ApiModelProperty({ type: Number })
  price: number;

  @ApiModelProperty({ type: String, isArray: true })
  images: string[];

  @ApiModelProperty({ type: UserDto })
  @Type(dtoGetter(UserDto))
  user: UserDto;

  @ApiModelProperty({ type: Boolean })
  isOwner: boolean;

  @ApiModelProperty({ type: Date })
  created: Date;

  @ApiModelProperty({ type: Date })
  updated: Date;

  @Exclude()
  deleted: Date;
}
