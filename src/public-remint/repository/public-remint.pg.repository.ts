import { AbstractRepository, EntityRepository } from 'typeorm';
import { PublicRemint } from '../entity/public-remint.entity';
import { PublicRemintRepository } from './public-remint.repository';

@EntityRepository(PublicRemint)
export class PgPublicRemint
  extends AbstractRepository<PublicRemint>
  implements PublicRemintRepository
{
  getByDerugData(derugData: string): Promise<PublicRemint[]> {
    return this.repository.find({ where: { derugData } });
  }
  getNewNftData(mint: string): Promise<PublicRemint> {
    return this.repository.findOne({ where: { mint: mint } });
  }
  getByMetadata(mint: string): Promise<PublicRemint> {
    return this.repository.findOne({ where: { mint } });
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
