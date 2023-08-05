import { Logger, NotFoundException } from '@nestjs/common';
import { PublicRemintRepository } from '../repository/public-remint.pg.repository';

export class UpdateReminted {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}

  private readonly logger = new Logger(UpdateReminted.name);

  async execute(metadata: string, reminter: string) {
    try {
      const nft = await this.publicRemintRepo.getByMetadata(metadata);
      if (!nft) throw new NotFoundException('NFT not found');
      nft.dateReminted = new Date();
      nft.remintAuthority = reminter;
      await this.publicRemintRepo.updateRemintedNft(nft);
      this.logger.debug(
        `'Reminted NFT with metadata address:${metadata} by wallet:${reminter}')`,
      );
    } catch (error) {
      this.logger.error(`Failed to update remint data:`, error.message);
    }
  }
}
