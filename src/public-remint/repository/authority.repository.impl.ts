import { Keypair } from '@solana/web3.js';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Authority } from '../entity/authority.entity';

import { encode } from 'bs58';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class AuthorityRepository extends Repository<Authority> {
  constructor(dataSource: DataSource) {
    super(Authority, dataSource.createEntityManager());
  }

  get(derugData: string): Promise<Authority> {
    return this.findOne({ where: { derugData } });
  }
  async storeAuthority(derugData: string): Promise<string> {
    const authorityKp = Keypair.generate();
    const secret = encode(authorityKp.secretKey);
    const firstCreator = Keypair.generate();
    const authority: Authority = {
      derugData,
      pubkey: authorityKp.publicKey.toString(),
      secretKey: secret,
      firstCreator: firstCreator.publicKey.toString(),
      firstCreatorSecretKey: encode(firstCreator.secretKey),
    };
    await this.save(authority);
    return authorityKp.publicKey.toString();
  }
  async getByDerugData(
    derugData: string,
  ): Promise<{ authority: string; firstCreator: string }> {
    const authority = await this.findOne({ where: { derugData } });
    if (!authority) {
      throw new NotFoundException('Given authority does not exist!');
    }
    return {
      authority: authority.pubkey,
      firstCreator: authority.firstCreator,
    };
  }
}
