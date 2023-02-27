import { Module } from '@nestjs/common';
import { DerugFormService } from './derug-form.service';
import { DerugFormController } from './derug-form.controller';

@Module({
  controllers: [DerugFormController],
  providers: [DerugFormService]
})
export class DerugFormModule {}
