import { PublicRemintRepository } from '../repository/public-remint.repository';

export class GetNonMinted {
  constructor(private readonly pulbicRemintRepo: PublicRemintRepository) {}
  execute(derugData: string) {
    return this.pulbicRemintRepo.getNonMintedNfts(derugData);
  }
}
