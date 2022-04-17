import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryService } from 'app/summary/services';
import { SummaryController } from 'app/summary/controllers';
import { BalanceEntity, SummaryEntity } from 'app/summary/entities';
import { MovementModule } from 'app/movement/movement.module';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService],
  imports: [
    TypeOrmModule.forFeature([SummaryEntity, BalanceEntity]),
    MovementModule,
  ],
})
export class SummaryModule {}
