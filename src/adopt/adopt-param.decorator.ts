import { createParamDecorator } from '@nestjs/common';

export const AdoptParam = createParamDecorator((data, req) => req.adopt);
