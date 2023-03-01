import { Controller, Get, Param } from '@nestjs/common';
import { MagicEdenCollectionsService } from './magic-eden-collections.service';
import { GetFlaggedCollections } from './so/get-flagged-collections';

@Controller('magic-eden-collections')
export class MagicEdenCollectionsController {
  constructor(
    private readonly magicEdenCollectionsService: MagicEdenCollectionsService,
  ) {}
  @Get('/flagged/:pageNumber')
  getFlagged(@Param('pageNumber') pageNumber: number) {
    return this.magicEdenCollectionsService.getFlagged(pageNumber);
  }
}
