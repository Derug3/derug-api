import { Logger } from '@nestjs/common';
import { PublicRemintRepository } from '../repository/public-remint.repository';

export class UpdateMintedNft {
  constructor(private readonly publicMintRepo: PublicRemintRepository) {}
  private logger = new Logger(UpdateMintedNft.name);
  async execute(oldMint: string, reminter: string) {
    try {
      const nonMinted = await this.publicMintRepo.getByMetadata(oldMint);
      if (!nonMinted) {
        this.logger.error('NFT that has been minted does not exist in DB!');
        return;
      }
      nonMinted.dateReminted = new Date();
      nonMinted.remintAuthority = reminter;
      nonMinted.hasReminted = true;
      await this.publicMintRepo.updateRemintedNft(nonMinted);
    } catch (error) {
      this.logger.error('Failed to store in DB:', error.message);
    }
  }
}
