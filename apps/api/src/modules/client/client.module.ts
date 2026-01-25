import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { SupportMonthsController } from './support-months/support-months.controller';
import { SupportMonthsService } from './support-months/support-months.service';

@Module({
  controllers: [ClientController, SupportMonthsController],
  providers: [ClientService, SupportMonthsService],
  exports: [ClientService],
})
export class ClientModule {}
