import { UserTwitterData } from '../entity/user-twitter.entity';
import { UserTwitterRepository } from '../repositry/user-twitter.repository';

export class StoreTwitterCodes {
  constructor(private readonly twitterRepo: UserTwitterRepository) {}

  async execute(code: string, codeVerifier: string, pubKey: string) {
    const userTwitterData = new UserTwitterData();

    userTwitterData.code = code;
    userTwitterData.pubkey = pubKey;
    userTwitterData.codeVerifier = codeVerifier;

    await this.twitterRepo.storeUserData(userTwitterData);
  }
}
