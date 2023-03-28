import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CandyMachineDto } from './dto/candy-machine.dto';
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

  @Get('/:derugData')
  getCandyMachine(@Param('derugData') derugData: string) {
    return this.publicRemintService.getCandyMachineData(derugData);
  }

  @Post('/save')
  saveCandyMachine(@Body() candyMachine: CandyMachineDto) {
    return this.publicRemintService.storeCandyMachineData(candyMachine);
  }
}
