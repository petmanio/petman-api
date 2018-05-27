import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  async validateUser(token: string): Promise<any> {
  }
}
