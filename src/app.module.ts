import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database/database.module';
import { validate } from 'config/validator';
import { AppController } from './app.controller';
import { CategoryModule } from 'app/category/category.module';
import { SharedModule } from 'app/shared/shared.module';
import { MovementModule } from 'app/movement/movement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    CategoryModule,
    SharedModule,
    MovementModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
