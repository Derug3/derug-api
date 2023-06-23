import { BadRequestException, Logger } from '@nestjs/common';
import { ME, TWITTER_API, USERS } from 'src/utilities/constants';
import { redirectUri, v2Client } from 'src/utilities/utils';
import Client from 'twitter-api-sdk';
import { UserTwitterData } from '../entity/user-twitter.entity';
import { UserTwitterRepository } from '../repositry/user-twitter.repository';

export class StoreUserTwitter {
  constructor(private readonly userTwitterRepo: UserTwitterRepository) {}

  private logger = new Logger(StoreUserTwitter.name);

  async execute(code: string, pubKey: string) {
    try {
      const relatedUser = await this.userTwitterRepo.getUserTwitterData(pubKey);

      if (!relatedUser.code || !relatedUser.codeVerifier) {
        throw new BadRequestException('Invalid twitter auth data!');
      }

      const token = await v2Client.loginWithOAuth2({
        code: code,
        codeVerifier: relatedUser.codeVerifier,
        redirectUri: `${process.env.REDIRECT_URL!}?pubkey=${pubKey}`,
      });

      const user = await token.client.v2.me({
        'user.fields': [
          'url',
          'profile_image_url',
          'description',
          'created_at',
          'location',
          'verified',
        ],
      });

      await this.userTwitterRepo.storeUserData({
        accessToken: token.accessToken,
        description: user.data.description!,
        image: user.data.profile_image_url,
        location: user.data.location,
        pubkey: pubKey,
        twitterHandle: user.data.username,
        twitterName: user.data.name,
        verified: user.data.verified,
      });

      this.logger.debug(
        `User ${user.data.name} with twitter username ${user.data.username}`,
      );
    } catch (error) {
      console.log(error);

      this.logger.error(error);
      throw new BadRequestException('Failed to store user twitter data');
    }
  }
}
