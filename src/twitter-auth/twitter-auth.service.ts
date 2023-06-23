import { Injectable, Logger } from '@nestjs/common';
import { REDIRECT, TWITTER_AUTH } from 'src/utilities/constants';
import { redirectUri, v2Client } from 'src/utilities/utils';
import Client, { auth } from 'twitter-api-sdk';
import { AuthClient } from 'twitter-api-sdk/dist/types';
import TwitterApi from 'twitter-api-v2';
import { UserTwitterRepository } from './repositry/user-twitter.repository';
import { StoreUserTwitter } from './so/store-user-twitter.so';
import { StoreTwitterCodes } from './so/store_codes';

@Injectable()
export class TwitterAuthService {
  private storeTwitterData: StoreUserTwitter;
  private storeTwitterCodes: StoreTwitterCodes;

  private logger = new Logger(TwitterAuthService.name);

  constructor(private readonly userTwitterRepo: UserTwitterRepository) {
    this.storeTwitterData = new StoreUserTwitter(userTwitterRepo);
    this.storeTwitterCodes = new StoreTwitterCodes(userTwitterRepo);
  }

  async authUser(pubKey: string) {
    const { codeVerifier, codeChallenge, url, state } =
      v2Client.generateOAuth2AuthLink(
        `${process.env.REDIRECT_URL!}?pubkey=${pubKey}`,
        {
          scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        },
      );

    await this.storeTwitterCodes.execute(codeChallenge, codeVerifier, pubKey);

    return url;
  }

  async fetchUserTwitterData(code: string, pubkey: string) {
    return await this.storeTwitterData.execute(code, pubkey);
  }
  getUserTwitterByPubkey(pubkey: string) {
    return this.userTwitterRepo.getUserTwitterData(pubkey);
  }

  unlinkUserTwitter(pubkey: string) {
    this.logger.verbose(`User with pubkey ${pubkey} unlinked twitter account`);
    return this.userTwitterRepo.unlinkTwitter(pubkey);
  }
}
