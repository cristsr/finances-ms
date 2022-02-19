import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database/database.module';
import { validate } from 'config/validator';
import { AppController } from './app.controller';
import { CategoryModule } from 'app/category/category.module';
import { MovementModule } from 'app/movement/movement.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    CategoryModule,
    MovementModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
