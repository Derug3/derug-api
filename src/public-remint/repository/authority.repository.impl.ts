import { Keypair } from '@solana/web3.js';
import { EntityRepository, Repository } from 'typeorm';
import { Authority } from '../entity/authority.entity';
import { AuthorityRepository } from './authority.repository';
import { encode } from 'bs58';
import { NotFoundException } from '@nestjs/common';
@EntityRepository(Authority)
export class PgAuthorityRepository
  extends Repository<Authority>
  implements AuthorityRepository
{
  get(derugData: string): Promise<Authority> {
    return this.findOne({ where: { derugData } });
  }
  async storeAuthority(derugData: string): Promise<string> {
    const authorityKp = Keypair.generate();
    const secret = encode(authorityKp.secretKey);
    const authority: Authority = {
      derugData,
      pubkey: authorityKp.publicKey.toString(),
      secretKey: secret,
    };
    await this.save(authority);
    return authorityKp.publicKey.toString();
  }
  async getByDerugData(derugData: string): Promise<string> {
    const authority = await this.findOne({ where: { derugData } });
    if (!authority) {
      throw new NotFoundException('Given authority does not exist!');
    }
    return authority.pubkey;
  }
}
