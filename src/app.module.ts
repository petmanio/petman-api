import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { ShelterModule } from './shelter/shelter.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserMiddleware } from './shared/user.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    SharedModule,
    AuthModule,
    UserModule,
    ShelterModule,
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
