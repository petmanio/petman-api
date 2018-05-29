import { createParamDecorator } from '@nestjs/common';

export const LostFoundParam = createParamDecorator((data, req) => req.lostFound);
