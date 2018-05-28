import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { ShelterService } from './shelter.service';

@Injectable()
export class ShelterMiddleware implements NestMiddleware {
  constructor(private shelterService: ShelterService) {
  }

  async resolve(name: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      // TODO: middleware executed twice
      if (!req.params.id) {
        return next();
      }
      req.shelter = await this.shelterService.findById(req.params.id);
      next();
    };
  }
}
