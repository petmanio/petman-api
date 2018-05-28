import { ApiModelProperty } from '@nestjs/swagger';
import { dtoGetter } from '../../lib';

export class CommonListDto<T> {
  @ApiModelProperty({ type: Number })
  readonly total;

  @Type(dtoGetter(T))
  readonly list: T[];
}
