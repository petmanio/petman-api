import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { UserMiddleware } from './user.middleware';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UserModule],
  providers: [UserMiddleware, AuthGuard],
  controllers: [],
  exports: [AuthGuard],
})
export class SharedModule {
}
