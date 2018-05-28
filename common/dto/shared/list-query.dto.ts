import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ListQueryDto {
  @ApiModelProperty({ type: Number })
  @IsNumberString
  readonly offset;

  @ApiModelProperty({ type: Number })
  @IsNumberString()
  readonly limit;
}
