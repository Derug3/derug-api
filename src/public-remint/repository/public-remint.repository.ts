import { PublicRemint } from '../entity/public-remint.entity';

export abstract class PublicRemintRepository {
  abstract storeAllCollectionNfts(
    nfts: PublicRemint[],
  ): Promise<PublicRemint[]>;
  abstract getNonMintedNfts(creator: string): Promise<PublicRemint[]>;
  abstract updateRemintedNft(nft: PublicRemint): Promise<PublicRemint>;
  abstract getByMetadata(metadata: string): Promise<PublicRemint>;
}
