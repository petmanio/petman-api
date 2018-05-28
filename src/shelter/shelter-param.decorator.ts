import { createParamDecorator } from '@nestjs/common';

export const ShelterParam = createParamDecorator((data, req) => req.shelter);
