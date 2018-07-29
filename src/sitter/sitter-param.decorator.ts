import { createParamDecorator } from '@nestjs/common';

export const SitterParam = createParamDecorator((data, req) => req.sitter);
