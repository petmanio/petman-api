import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { AdoptService } from './adopt.service';

@Injectable()
export class AdoptMiddleware implements NestMiddleware {
  constructor(private adoptService: AdoptService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id) {
        return next();
      }
      req.adopt = await this.adoptService.findById(req.params.id);
      next();
    };
  }
}
