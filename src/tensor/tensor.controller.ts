import { Controller, Get, Param } from '@nestjs/common';
import { ICollectionStats } from './dto/tensor.dto';
import { TensorService } from './tensor.service';

@Controller('tensor')
export class TensorController {
  constructor(private readonly tensorService: TensorService) {}

  @Get('/fp/:slug')
  getFpStats(@Param('slug') slug: string) {
    const stats: ICollectionStats = {
      firstListed: 10,
      fp: 10,
      marketCap: 10,
      numListed: 10,
      numMints: 200,
      royalty: 1,
      slug: 'nice_mice',
      volume24H: 20,
    };

    return stats;
  }

  @Get('/traits/:slug')
  getTraits(@Param('slug') slug: string) {
    return [];
  }

  @Get('/listings/:slug')
  getListings(@Param('slug') slug: string) {
    return [];
  }

  @Get('/activities/:slug')
  getRecentActivities(@Param('slug') slug: string) {
    return [];
  }
}
