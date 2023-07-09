import { Injectable, Logger } from '@nestjs/common';
import { UserDiscordRepository } from './repository/user-discord.repository';
import { StoreUserDiscord } from './so/store-user-discord.so';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class DiscordAuthService {
  private storeDiscordData: StoreUserDiscord;

  private logger = new Logger(StoreUserDiscord.name);

  constructor(private readonly userTwitterRepo: UserDiscordRepository) {
    this.storeDiscordData = new StoreUserDiscord(userTwitterRepo);
  }

  async authUser(code: string, pubkey: string, res: Response) {
   const discordTokenUrl = 'https://discord.com/api/oauth2/token';
    const discordUserUrl = 'https://discord.com/api/users/@me';
    const data = {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URL,
      scope: 'identify',
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    try {
      const tokenResponse = await axios.post(discordTokenUrl, new URLSearchParams(data), { headers });
      const userResponse = await axios.get(discordUserUrl, { headers: { authorization: `Bearer ${tokenResponse.data.access_token}` } });
      const token = jwt.sign({ discordId: userResponse.data.id }, 'secretKey');
      res.redirect(`http://localhost:8082/auth/discord/callback?token=${token}?pubkey=${pubkey}`);
    } catch (error) {
      this.logger.error(error);
      res.redirect('http://localhost:8082/auth/discord/callback?error=discord');
    }
      
  }

//   async fetchUserTwitterData(code: string, pubkey: string) {
//     return await this.storeTwitterData.execute(code, pubkey);
//   }
//   getUserTwitterByPubkey(pubkey: string) {
//     return this.userTwitterRepo.getUserTwitterData(pubkey);
//   }

//   unlinkUserTwitter(pubkey: string) {
//     this.logger.verbose(`User with pubkey ${pubkey} unlinked twitter account`);
//     return this.userTwitterRepo.unlinkTwitter(pubkey);
//   }
}
