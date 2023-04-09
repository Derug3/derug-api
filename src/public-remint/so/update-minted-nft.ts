import { Logger } from '@nestjs/common';
import { PublicRemintRepository } from '../repository/public-remint.repository';

export class UpdateMintedNft {
  constructor(private readonly publicMintRepo: PublicRemintRepository) {}
  private logger = new Logger(UpdateMintedNft.name);
  async execute(data: any) {
    try {
      console.log(data);

      const nonMinted = await this.publicMintRepo.getByMetadata(
        data.oldNftMetadata,
      );
      if (!nonMinted) {
        this.logger.error('NFT that has been minted does not exist in DB!');
        return;
      }
      nonMinted.dateReminted = new Date();
      nonMinted.remintAuthority = data.remintAuthority.toString();
      nonMinted.hasReminted = true;
      await this.publicMintRepo.updateRemintedNft(nonMinted);
    } catch (error) {}
  }
}
