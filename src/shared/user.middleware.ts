import * as config from 'config';
import { verify } from 'jsonwebtoken';
import { find } from 'lodash';
import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { UserService } from '../user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      let token = req.header('authorization') || '';
      token = token.replace('bearer ', '');

      let selectedUserId = req.header('authorization-selected-user');
      selectedUserId = selectedUserId && parseInt(selectedUserId, 0);

      try {
        const { id } = <any>verify(token, config.get('secret'));
        req.user = await this.userService.findById(id);

        const selectedUser = find(req.user ? req.user.businessUsers : [], { id: selectedUserId });
        req.selectedUser = selectedUser || req.user;
        next();
      } catch (err) {
        next();
      }
    };
  }
}
