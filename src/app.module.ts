import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as config from 'config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { ShelterModule } from './shelter/shelter.module';
import { WalkerModule } from './walker/walker.module';
import { AdoptModule } from './adopt/adopt.module';
import { LostFoundModule } from './lost-found/lost-found.module';
import { ServiceModule } from './service/service.module';
import { OrganizationModule } from './organization/organization.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserMiddleware } from './shared/user.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.get('orm')),

    SharedModule,
    AuthModule,
    UserModule,
    ShelterModule,
    WalkerModule,
    AdoptModule,
    LostFoundModule,
    ServiceModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserMiddleware)
      .with('AppModule')
      .forRoutes('*');
  }
}
