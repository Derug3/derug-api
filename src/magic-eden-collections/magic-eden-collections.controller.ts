import { Controller, Get, Param } from '@nestjs/common';
import { MagicEdenCollectionsService } from './magic-eden-collections.service';

@Controller('magic-eden-collections')
export class MagicEdenCollectionsController {
  constructor(
    private readonly magicEdenCollectionsService: MagicEdenCollectionsService,
  ) {}
  @Get('/flagged/:pageNumber')
  getFlagged(@Param('pageNumber') pageNumber: number) {
    return this.magicEdenCollectionsService.getFlagged(pageNumber);
  }

  @Get('random')
  getRandomCollections() {
    return this.magicEdenCollectionsService.getRandom();
  }

  @Get('/name/:name')
  getByName(@Param('name') name: string) {
    return this.magicEdenCollectionsService.getCollectionByName(name);
  }

  @Get('symbol/:symbol')
  getBySymbol(@Param('symbol') symbol: string) {
    return this.magicEdenCollectionsService.getSingleCollection(symbol);
  }

  @Get('/all')
  getAllCollections() {
    return this.magicEdenCollectionsService.getAllCollectionsSlugs();
  }
}
