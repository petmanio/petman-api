import { createParamDecorator } from '@nestjs/common';

export const WalkerParam = createParamDecorator((data, req) => req.walker);
