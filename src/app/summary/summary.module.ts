import { Module } from '@nestjs/common';
import { SummaryService } from './services/summary.service';
import { SummaryController } from './controllers/summary.controller';
import { MovementModule } from 'app/movement/movement.module';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService],
  imports: [MovementModule],
})
export class SummaryModule {}
