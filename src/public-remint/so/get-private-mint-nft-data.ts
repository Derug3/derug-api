import { NotFoundException } from '@nestjs/common';
import { PublicRemintRepository } from '../repository/public-remint.repository';

export class GetPrivateMintNftData {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}

  async execute(metadata: string) {
    try {
      const nftData = await this.publicRemintRepo.getNewNftData(metadata);
      if (!nftData) {
        throw new NotFoundException('Invalid old nft metadata.');
      }
      return nftData;
    } catch (error) {
      throw error;
    }
  }
}
