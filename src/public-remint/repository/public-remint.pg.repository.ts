import { AbstractRepository, EntityRepository } from 'typeorm';
import { PublicRemint } from '../entity/public-remint.entity';
import { PublicRemintRepository } from './public-remint.repository';

@EntityRepository(PublicRemint)
export class PgPublicRemint
  extends AbstractRepository<PublicRemint>
  implements PublicRemintRepository
{
  getNewNftData(metadata: string): Promise<PublicRemint> {
    return this.repository.findOne({ where: { nftMetadata: metadata } });
  }
  getByMetadata(metadata: string): Promise<PublicRemint> {
    return this.repository.findOne({ where: { nftMetadata: metadata } });
  }
  storeAllCollectionNfts(nfts: PublicRemint[]): Promise<PublicRemint[]> {
    return this.repository.save(nfts);
  }
  getNonMintedNfts(derugData: string): Promise<PublicRemint[]> {
    return this.repository.find({ where: { hasReminted: false, derugData } });
  }
  updateRemintedNft(nftMint: PublicRemint): Promise<PublicRemint> {
    return this.repository.save(nftMint);
  }
}
