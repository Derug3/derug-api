import { AbstractRepository, DeleteResult, EntityRepository } from 'typeorm';
import { UserDiscordData } from '../entity/user-discord.entity';
import { UserDiscordRepository } from './user-discord.repository';

@EntityRepository(UserDiscordData)
export class PgUserDiscordRepository
  // extends AbstractRepository<UserDiscordData>
  // implements UserDiscordRepository
{
  // storeUserData(user: UserDiscordData): Promise<UserDiscordData> {
  //   return this.repository.save(user);
  // }
  // getUserDiscordData(pubkey: string): Promise<UserDiscordData> {
  //   return this.repository.findOne({ where: { pubkey } });
  // }
  // async unlinkDiscord(pubkey: string): Promise<DeleteResult> {
  //   const user = await this.repository.findOne({ where: { pubkey } });
  //   return this.repository.delete(user);
  // }
}
