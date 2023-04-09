import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CandyMachineDto } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemintService } from './public-remint.service';

@Controller('public-remint')
export class PublicRemintController {
  constructor(private readonly publicRemintService: PublicRemintService) {}

  @Get('collection/:updateAuthority/:derugData')
  saveCollection(
    @Param('updateAuthority') updateAuthority: string,
    @Param('derugData') derugData: string,
  ) {
    console.log(derugData, 'DDATA');

    return this.publicRemintService.fetchAllNftsFromCollection(
      updateAuthority,
      derugData,
    );
  }

  @Get('non-minted/:derugData')
  getNonMinted(@Param('derugData') derugData: string) {
    return this.publicRemintService.getNonMintedNfts(derugData);
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
