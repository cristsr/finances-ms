import { Module } from '@nestjs/common';
import { BillService } from './services/bill.service';
import { BillController } from './controllers/bill.controller';

@Module({
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
