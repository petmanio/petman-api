import { createParamDecorator } from '@nestjs/common';

export const Shelter = createParamDecorator((data, req) => req.shelter);
