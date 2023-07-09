import { BadRequestException, Logger } from '@nestjs/common';
import { ME, TWITTER_API, USERS } from 'src/utilities/constants';
import { redirectUri, v2Client } from 'src/utilities/utils';
import Client from 'twitter-api-sdk';
// import { UserTwitterData } from '../entity/user-twitter.entity';
import { UserDiscordRepository } from '../repository/user-discord.repository';

export class StoreUserDiscord {
  constructor(private readonly userTwitterRepo: UserDiscordRepository) {}

  private logger = new Logger(StoreUserDiscord.name);

    async execute(code: string, pubKey: string) {
        
    }
}
