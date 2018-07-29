import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { SitterService } from './sitter.service';

@Injectable()
export class SitterMiddleware implements NestMiddleware {
  constructor(private sitterService: SitterService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id) {
        return next();
      }
      req.sitter = await this.sitterService.findById(req.params.id);
      next();
    };
  }
}
