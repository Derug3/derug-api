import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetNftsByUpdateAuthority } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemintService } from './public-remint.service';

@Controller('public-remint')
export class PublicRemintController {
  constructor(private readonly publicRemintService: PublicRemintService) {}

  @Post('collection')
  saveCollection(@Body() tx: GetNftsByUpdateAuthority) {
    console.log('Started fetching all NFTs');

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

  @Get('/metadata/:oldMetadata')
  getPrivateMintMetadta(@Param('oldMetadata') oldMetadata: string) {
    return this.publicRemintService.getNftData(oldMetadata);
  }
}
