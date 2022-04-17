import { Module } from '@nestjs/common';
import { SummaryService } from './services/summary.service';
import { SummaryController } from 'app/summary/controllers';
import { MovementModule } from 'app/movement/movement.module';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService],
  imports: [MovementModule],
})
export class SummaryModule {}
