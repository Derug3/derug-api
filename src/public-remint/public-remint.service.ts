import { Injectable } from '@nestjs/common';
import { CandyMachineDto } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { CandyMachineRepository } from './repository/candy-machine.repository';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { FetchAllNftsFromCollection } from './so/fetch-all-nfts';
import { GetCandyMachineData } from './so/get-candy-machine';
import { GetNonMinted } from './so/get-non-minted';
import { InitCandyMachine } from './so/init-candy-machine';
import { SaveCandyMachine } from './so/save-candy-machine';
import { UpdateReminted } from './so/update-reminted';

@Injectable()
export class PublicRemintService {
  private fetchAllNfts: FetchAllNftsFromCollection;
  private updateReminted: UpdateReminted;
  private getNonMinted: GetNonMinted;
  private saveCandyMachine: SaveCandyMachine;
  private getCandyMachine: GetCandyMachineData;
  constructor(
    private readonly publicRemintRepo: PublicRemintRepository,
    private readonly candyMachineRepo: CandyMachineRepository,
  ) {
    this.fetchAllNfts = new FetchAllNftsFromCollection(publicRemintRepo);
    this.updateReminted = new UpdateReminted(publicRemintRepo);
    this.getNonMinted = new GetNonMinted(publicRemintRepo);
    this.saveCandyMachine = new SaveCandyMachine(candyMachineRepo);
    this.getCandyMachine = new GetCandyMachineData(candyMachineRepo);
  }

  fetchAllNftsFromCollection(firstCreator: string) {
    return this.fetchAllNfts.execute(firstCreator);
  }

  getNonMintedNfts(firstCreator: string) {
    return this.getNonMinted.execute(firstCreator);
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
}
