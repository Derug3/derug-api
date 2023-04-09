import { JsonMetadata, Metadata, Nft, Sft } from '@metaplex-foundation/js';
import {} from '@metaplex-foundation/mpl-token-metadata';
import { BadRequestException, Logger } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { mpx } from 'src/utilities/utils';
import { PublicRemint } from '../entity/public-remint.entity';
import { PublicRemintRepository } from '../repository/public-remint.repository';

export class FetchAllNftsFromCollection {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}

  private logger = new Logger(FetchAllNftsFromCollection.name);

  async execute(updateAuthority: string, derugData: string) {
    try {
      const allNfts = await mpx.nfts().findAllByUpdateAuthority({
        updateAuthority: new PublicKey(updateAuthority),
      });

      const remintData: PublicRemint[] = [];
      for (const nft of allNfts) {
        remintData.push(this.mapNftToRemintData(nft, derugData));
      }
      this.logger.debug(`Stored data for Derug Data:${derugData}`);
      await this.publicRemintRepo.storeAllCollectionNfts(remintData);
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Failed to fetch all NFTs from rugged collection.',
      );
    }
  }

  mapNftToRemintData(
    nft: Metadata<JsonMetadata<string>> | Nft | Sft,
    derugData: string,
  ) {
    const remintData = new PublicRemint();

    remintData.dateReminted = null;
    remintData.hasReminted = false;
    remintData.name = nft.name;
    remintData.nftMetadata = nft.address.toString();
    remintData.remintAuthority = null;
    remintData.uri = nft.uri;
    remintData.creator = nft.creators[0].address.toString();
    remintData.derugData = derugData;

    return remintData;
  }
}
