import { Injectable } from '@nestjs/common';
import { oauthConfig, twitterApi } from 'src/utilities/utils';
import Client, { auth } from 'twitter-api-sdk';
import { AuthClient } from 'twitter-api-sdk/dist/types';
import TwitterApi from 'twitter-api-v2';
import { UserTwitterRepository } from './repositry/user-twitter.repository';
import { StoreUserTwitter } from './so/store-user-twitter.so';

@Injectable()
export class TwitterAuthService {
  private storeTwitterData: StoreUserTwitter;

  constructor(private readonly userTwitterRepo: UserTwitterRepository) {
    this.storeTwitterData = new StoreUserTwitter(userTwitterRepo);
  }

  async authUser(collectionSlug: string) {
    return oauthConfig.generateAuthURL({
      state: collectionSlug,
      code_challenge_method: 's256',
    });
  }

  async fetchUserTwitterData(code: string, pubkey: string) {
    return await this.storeTwitterData.execute(code, pubkey);
  }

  getUserTwitterByPubkey(pubkey: string) {
    return this.userTwitterRepo.getUserTwitterData(pubkey);
  }

  unlinkUserTwitter(pubkey: string) {
    return this.userTwitterRepo.unlinkTwitter(pubkey);
  }
}
