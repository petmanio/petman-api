import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { UserService } from './user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id || isNaN(req.params.id)) {
        return next();
      }

      req.userEntity = await this.userService.findByIdWithUserData(req.params.id);
      next();
    };
  }
}
