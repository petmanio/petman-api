import { createParamDecorator } from '@nestjs/common';

export const UserEntityParam = createParamDecorator((data, req) => req.userEntity);
