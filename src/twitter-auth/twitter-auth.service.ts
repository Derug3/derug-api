import { Injectable } from '@nestjs/common';
import { oauthConfig } from 'src/utilities/utils';
import Client from 'twitter-api-sdk';
import TwitterApi from 'twitter-api-v2';

@Injectable()
export class TwitterAuthService {
  async authUser(collectionSlug: string) {
    return oauthConfig.generateAuthURL({
      state: collectionSlug,
      code_challenge_method: 's256',
    });
  }

  async fetchUserTwitterData(code: string) {
    try {
      const data = await oauthConfig.requestAccessToken(code);
      const client = new Client(data.token.access_token);
      const clientData = await client.users.findMyUser();
      console.log(clientData);
    } catch (error) {
      console.log(error);
    }
  }
}
