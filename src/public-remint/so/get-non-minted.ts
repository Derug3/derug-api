import { PublicRemintRepository } from '../repository/public-remint.repository';

export class GetNonMinted {
  constructor(private readonly pulbicRemintRepo: PublicRemintRepository) {}
  execute(firstCreator: string) {
    return this.pulbicRemintRepo.getNonMintedNfts(firstCreator);
  }
}
