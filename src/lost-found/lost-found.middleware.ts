import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { LostFoundService } from './lost-found.service';

@Injectable()
export class LostFoundMiddleware implements NestMiddleware {
  constructor(private lostFoundService: LostFoundService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id) {
        return next();
      }
      req.lostFound = await this.lostFoundService.findById(req.params.id);
      next();
    };
  }
}
