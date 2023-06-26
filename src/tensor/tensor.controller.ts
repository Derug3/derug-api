import { Controller, Get, Param } from '@nestjs/common';
import { TensorService } from './tensor.service';

@Controller('tensor')
export class TensorController {
  constructor(private readonly tensorService: TensorService) {}

  @Get('/fp/:slug')
  getFpStats(@Param('slug') slug: string) {
    return this.tensorService.getFloorPriceTensor(slug);
  }

  @Get('/traits/:slug')
  getTraits(@Param('slug') slug: string) {
    return this.tensorService.getTraitsTensor(slug);
  }

  @Get('/listings/:slug')
  getListings(@Param('slug') slug: string) {
    return this.tensorService.getTensorListings(slug);
  }

  @Get('/activities/:slug')
  getRecentActivities(@Param('slug') slug: string) {
    return this.tensorService.getTensorRecentActivities(slug);
  }
}
