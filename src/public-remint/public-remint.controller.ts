import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetNftsByUpdateAuthority } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { RemintDto } from './dto/remint.dto';
import { PublicRemintService } from './public-remint.service';

@Controller('public-remint')
export class PublicRemintController {
  constructor(private readonly publicRemintService: PublicRemintService) {}

  @Post('collection')
  saveCollection(@Body() tx: GetNftsByUpdateAuthority) {
    return this.publicRemintService.fetchAllNftsFromCollection(tx);
  }

  @Get('non-minted/:derugData')
  getNonMinted(@Param('derugData') derugData: string) {
    return this.publicRemintService.getNonMintedNfts(derugData);
  }

  @Get('/:derugData')
  getCandyMachine(@Param('derugData') derugData: string) {
    return this.publicRemintService.getCandyMachineData(derugData);
  }

  @Get('/save/:derugData')
  saveCandyMachine(@Param('derugData') derugData: string) {
    return this.publicRemintService.storePublicMintData(derugData);
  }

  @Post('save-minted')
  saveMintedNft(@Body() minted: { mint: string; reminter: string }) {
    return this.publicRemintService.saveReminted(minted.mint, minted.reminter);
  }

  @Post('/initialize')
  initializeCandyMachine(@Body() initCandyMachineDto: InitMachineRequestDto) {
    return this.publicRemintService.initCandyMacihine(initCandyMachineDto);
  }

  @Post('/remint')
  remintNft(@Body('remint') remint: RemintDto) {
    return this.publicRemintService.remintNftHandler(remint);
  }
}
