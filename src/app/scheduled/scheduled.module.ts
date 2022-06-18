import { Module } from '@nestjs/common';
import { ScheduledService } from 'app/scheduled/services';
import { ScheduledController } from 'app/scheduled/controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledEntity } from 'app/scheduled/entities';
import { CategoryModule } from 'app/category/category.module';

@Module({
  imports: [CategoryModule, TypeOrmModule.forFeature([ScheduledEntity])],
  controllers: [ScheduledController],
  providers: [ScheduledService],
})
export class ScheduledModule {}
