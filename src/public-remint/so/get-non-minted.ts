import { PublicRemintRepository } from '../repository/public-remint.pg.repository';

export class GetNonMinted {
  constructor(private readonly pulbicRemintRepo: PublicRemintRepository) {}
  execute(derugData: string) {
    return this.pulbicRemintRepo.getNonMintedNfts(derugData);
  }
}
