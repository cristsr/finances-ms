import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database/database.module';
import { validate } from 'src/environment/utils';
import { AppController } from './app.controller';
import { CategoryModule } from 'app/category/category.module';
import { MovementModule } from 'app/movement/movement.module';
import { SummaryModule } from 'app/summary/summary.module';
import { BudgetModule } from 'app/budget/budget.module';
import { BillModule } from 'app/bill/bill.module';
import { ScheduledModule } from 'app/scheduled/scheduled.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    CacheModule.register(),
    DatabaseModule,
    CategoryModule,
    MovementModule,
    SummaryModule,
    BudgetModule,
    BillModule,
    ScheduledModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
