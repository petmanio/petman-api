import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { WalkerService } from './walker.service';

@Injectable()
export class WalkerMiddleware implements NestMiddleware {
  constructor(private walkerService: WalkerService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id) {
        return next();
      }
      req.walker = await this.walkerService.findById(req.params.id);
      next();
    };
  }
}
