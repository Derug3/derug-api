import { UserMint } from '../entities/user-mint.entity';

export abstract class UserMintRepository {
  abstract storeUserMint(
    userPubkey: string,
    candyMachinePubkey: string,
  ): Promise<UserMint>;

  abstract getUserMints(
    userPubkey: string,
    candyMachinePubkey: string,
  ): Promise<UserMint>;
}
