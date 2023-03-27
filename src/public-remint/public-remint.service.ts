import { Injectable } from '@nestjs/common';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { FetchAllNftsFromCollection } from './so/fetch-all-nfts';
import { GetNonMinted } from './so/get-non-minted';
import { InitCandyMachine } from './so/init-candy-machine';
import { UpdateReminted } from './so/update-reminted';

@Injectable()
export class PublicRemintService {
  private fetchAllNfts: FetchAllNftsFromCollection;
  private updateReminted: UpdateReminted;
  private getNonMinted: GetNonMinted;
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {
    this.fetchAllNfts = new FetchAllNftsFromCollection(publicRemintRepo);
    this.updateReminted = new UpdateReminted(publicRemintRepo);
    this.getNonMinted = new GetNonMinted(publicRemintRepo);
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
}
