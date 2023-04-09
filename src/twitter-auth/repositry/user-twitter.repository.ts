import { DeleteResult } from 'typeorm';
import { UserTwitterData } from '../entity/user-twitter.entity';

export abstract class UserTwitterRepository {
  abstract storeUserData(user: UserTwitterData): Promise<UserTwitterData>;
  abstract getUserTwitterData(pubkey: string): Promise<UserTwitterData>;
  abstract unlinkTwitter(pubkey: string): Promise<DeleteResult>;
}
