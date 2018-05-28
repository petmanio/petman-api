import { createParamDecorator } from '@nestjs/common';

export const SelectedUser = createParamDecorator((data, req) => req.selectedUser);
