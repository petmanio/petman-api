import { createParamDecorator } from '@nestjs/common';

export const SelectedUserParam = createParamDecorator((data, req) => req.selectedUser);
