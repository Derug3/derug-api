import { Module } from '@nestjs/common';
import { TensorService } from './tensor.service';
import { TensorController } from './tensor.controller';

@Module({
  controllers: [TensorController],
  providers: [TensorService],
  exports: [TensorService],
})
export class TensorModule {}
