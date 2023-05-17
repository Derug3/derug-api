import { BadRequestException, Logger } from '@nestjs/common';
import { ME, TWITTER_API, USERS } from 'src/utilities/constants';
import { oauthConfig, twitterClient } from 'src/utilities/utils';
import { UserTwitterData } from '../entity/user-twitter.entity';
import { UserTwitterRepository } from '../repositry/user-twitter.repository';

export class StoreUserTwitter {
  constructor(private readonly userTwitterRepo: UserTwitterRepository) {}

  private logger = new Logger(StoreUserTwitter.name);

  async execute(code: string, pubKey: string) {
    try {
      const token = await oauthConfig.requestAccessToken(code);

      const userResponse = await (
        await fetch(TWITTER_API + USERS + ME, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.token.access_token}`,
          },
        })
      ).json();

      const data = await twitterClient.users.findUserById(
        userResponse.data.id,
        {
          'user.fields': [
            'url',
            'profile_image_url',
            'description',
            'created_at',
            'location',
            'verified',
          ],
        },
      );
      await this.userTwitterRepo.storeUserData(
        this.mapUserDto(
          data.data,
          pubKey,
          userResponse.data.name,
          userResponse.data.username,
          token.token.access_token,
        ),
      );
      this.logger.debug(
        `User ${data.data.name} with twitter username ${data.data.username}`,
      );
    } catch (error) {
      console.log(error);

      this.logger.error(error);
      throw new BadRequestException('Failed to store user twitter data');
    }
  }

  mapUserDto(
    data: any,
    pubkey: string,
    username: string,
    name: string,
    accessToken: string,
  ): UserTwitterData {
    return {
      description: data.description,
      image: data.profile_image_url,
      location: data.location,
      pubkey,
      twitterHandle: username,
      twitterName: name,
      verified: data.verified,
      accessToken,
    };
  }
}
