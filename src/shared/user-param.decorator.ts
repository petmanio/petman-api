import * as config from 'config';
import { createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const User = createParamDecorator((data, req) => {
  // TODO: user middleware
  if (req.user) {
    return req.user;
  }

  let user = {};
  let token = req.header('authorization') || '';
  token = token.replace('bearer ', '');
  if (token) {
    user = verify(token, config.get('secret'));
  }
  return user;
});
