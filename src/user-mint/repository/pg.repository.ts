import { AbstractRepository, EntityRepository } from 'typeorm';
import { UserMint } from '../entities/user-mint.entity';
import { UserMintRepository } from './repository';

@EntityRepository(UserMint)
export class PgUserMint
  extends AbstractRepository<UserMint>
  implements UserMintRepository
{
  async storeUserMint(
    userPubkey: string,
    candyMachinePubkey: string,
  ): Promise<UserMint> {
    try {
      const existingUserMint = await this.repository.findOne({
        where: { userPubkey, candyMachine: candyMachinePubkey },
      });
      if (!existingUserMint) {
        return await this.repository.save({
          candyMachine: candyMachinePubkey,
          mintedCount: 1,
          userPubkey,
        });
      } else {
        existingUserMint.mintedCount = existingUserMint.mintedCount + 1;

        return await this.repository.save(existingUserMint);
      }
    } catch (error) {
      console.log(error);
    }
  }
  getUserMints(
    userPubkey: string,
    candyMachinePubkey: string,
  ): Promise<UserMint> {
    return this.repository.findOne({
      where: { userPubkey, candyMachine: candyMachinePubkey },
    });
  }
}
