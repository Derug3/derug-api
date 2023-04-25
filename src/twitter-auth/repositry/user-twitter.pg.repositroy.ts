import { AbstractRepository, DeleteResult, EntityRepository } from 'typeorm';
import { UserTwitterData } from '../entity/user-twitter.entity';
import { UserTwitterRepository } from './user-twitter.repository';

@EntityRepository(UserTwitterData)
export class PgUserTwitterRepository
  extends AbstractRepository<UserTwitterData>
  implements UserTwitterRepository
{
  storeUserData(user: UserTwitterData): Promise<UserTwitterData> {
    return this.repository.save(user);
  }
  getUserTwitterData(pubkey: string): Promise<UserTwitterData> {
    return this.repository.findOne({ where: { pubkey } });
  }
  async unlinkTwitter(pubkey: string): Promise<DeleteResult> {
    const user = await this.repository.findOne({ where: { pubkey } });
    return this.repository.delete(user);
  }
}
