import { Authority } from '../entity/authority.entity';

export abstract class AuthorityRepository {
  abstract storeAuthority(derugData: string): Promise<string>;
  abstract getByDerugData(derugData: string): Promise<string>;
  abstract get(derugData: string): Promise<Authority>;
}
