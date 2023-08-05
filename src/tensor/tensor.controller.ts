import { Controller, Get, Param } from '@nestjs/common';
import { ICollectionStats } from './dto/tensor.dto';
import { TensorService } from './tensor.service';

@Controller('tensor')
export class TensorController {
  constructor(private readonly tensorService: TensorService) {}

  @Get('/listings/:slug')
  getTraits(@Param('slug') slug: string) {
    return this.tensorService.getListings(slug);
  }

  @Get('/stats/:slug')
  getListings(@Param('slug') slug: string) {
    return this.tensorService.getStats(slug);
  }

  @Get('/store_stats/:slug')
  storeStats(@Param('slug') slug: string) {
    return this.tensorService.storeStats(slug);
  }
}
