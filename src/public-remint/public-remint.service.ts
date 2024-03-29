import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { derugProgram } from 'src/utilities/utils';
import {
  CandyMachineDto,
  GetNftsByUpdateAuthority,
} from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemint } from './entity/public-remint.entity';
import { CandyMachineRepository } from './repository/candy-machine.repository';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { FetchAllNftsFromCollection } from './so/fetch-all-nfts';
import { GetCandyMachineData } from './so/get-candy-machine';
import { GetNonMinted } from './so/get-non-minted';
import { GetPrivateMintNftData } from './so/get-private-mint-nft-data';
import { InitCandyMachine } from './so/init-candy-machine';
import { SaveCandyMachine } from './so/save-candy-machine';
import { UpdateMintedNft } from './so/update-minted-nft';
import { UpdateReminted } from './so/update-reminted';

@Injectable()
export class PublicRemintService implements OnModuleInit {
  private fetchAllNfts: FetchAllNftsFromCollection;
  private updateReminted: UpdateReminted;
  private getNonMinted: GetNonMinted;
  private saveCandyMachine: SaveCandyMachine;
  private getCandyMachine: GetCandyMachineData;
  private updateMintedNft: UpdateMintedNft;
  private getPrivateMintNftData: GetPrivateMintNftData;
  constructor(
    private readonly publicRemintRepo: PublicRemintRepository,
    private readonly candyMachineRepo: CandyMachineRepository,
  ) {
    this.fetchAllNfts = new FetchAllNftsFromCollection(publicRemintRepo);
    this.updateReminted = new UpdateReminted(publicRemintRepo);
    this.getNonMinted = new GetNonMinted(publicRemintRepo);
    this.saveCandyMachine = new SaveCandyMachine(candyMachineRepo);
    this.getCandyMachine = new GetCandyMachineData(candyMachineRepo);
    this.updateMintedNft = new UpdateMintedNft(publicRemintRepo);
    this.getPrivateMintNftData = new GetPrivateMintNftData(publicRemintRepo);
  }
  private readonly logger = new Logger(PublicRemintService.name);
  async onModuleInit() {
    this.logger.debug(
      `Subscribed to event listener ${derugProgram.programId.toString()}`,
    );
    derugProgram.addEventListener('NftRemintedEvent', async (data) => {
      try {
        await this.updateMintedNft.execute(
          data.oldNftMint.toString(),
          data.reminter.toString(),
        );
        this.logger.debug(`Minted NFT:${data.oldNftMint.toString()}`);
      } catch (error) {}
    });
  }

  fetchAllNftsFromCollection(tx: GetNftsByUpdateAuthority) {
    return this.fetchAllNfts.execute(tx.updateAuthority, tx.derugData, tx);
  }

  saveReminted(mint: string, reminter: string) {
    return this.updateMintedNft.execute(mint, reminter);
  }

  getNonMintedNfts(derugData: string) {
    return this.getNonMinted.execute(derugData);
  }

  updateRemintedNft(metadata: string, wallet: string) {
    return this.updateReminted.execute(metadata, wallet);
  }

  storeCandyMachineData(candyMachineDto: CandyMachineDto) {
    return this.saveCandyMachine.execute(candyMachineDto);
  }

  getCandyMachineData(derugData: string) {
    return this.getCandyMachine.execute(derugData);
  }

  getNftData(metadata: string) {
    return this.getPrivateMintNftData.execute(metadata);
  }
}
