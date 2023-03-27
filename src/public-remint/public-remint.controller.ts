import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemintService } from './public-remint.service';

@Controller('public-remint')
export class PublicRemintController {
  constructor(private readonly publicRemintService: PublicRemintService) {}

  @Get('collection/:firstCreator')
  saveCollection(@Param('firstCreator') firstCreator: string) {
    return this.publicRemintService.fetchAllNftsFromCollection(firstCreator);
  }

  @Get('collection/non-minted/:firstCreator')
  getNonMinted(@Param('firstCreator') firstCreator: string) {
    return this.publicRemintService.getNonMintedNfts(firstCreator);
  }
}
