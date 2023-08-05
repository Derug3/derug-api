import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PublicRemint } from '../entity/public-remint.entity';

@Injectable()
export class PublicRemintRepository extends Repository<PublicRemint> {
  constructor(dataSource: DataSource) {
    super(PublicRemint, dataSource.createEntityManager());
  }
  getByDerugData(derugData: string): Promise<PublicRemint[]> {
    return this.find({ where: { derugData } });
  }
  getNewNftData(mint: string): Promise<PublicRemint> {
    return this.findOne({ where: { mint: mint } });
  }
  getByMetadata(mint: string): Promise<PublicRemint> {
    return this.findOne({ where: { mint } });
  }
  storeAllCollectionNfts(nfts: PublicRemint[]): Promise<PublicRemint[]> {
    return this.save(nfts);
  }
  getNonMintedNfts(derugData: string): Promise<PublicRemint[]> {
    return this.find({ where: { hasReminted: false, derugData } });
  }
  updateRemintedNft(nftMint: PublicRemint): Promise<PublicRemint> {
    return this.save(nftMint);
  }
}
