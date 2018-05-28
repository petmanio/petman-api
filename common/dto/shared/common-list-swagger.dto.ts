import { ApiModelProperty } from '@nestjs/swagger';

export class CommonListSwaggerDto {
  @ApiModelProperty({ type: Number })
  readonly total;

  @ApiModelProperty({ type: Object, isArray: true })
  readonly list: any[];
}
