import { Controller, Get, Redirect, Query, Res } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { DiscordAuthService } from './discord-auth.service';


@Controller('auth/discord')
export class DiscordAuthController {
   constructor(private readonly discordAuthService: DiscordAuthService) {}
  private logger = new Logger(DiscordAuthController.name);

  @Get()
  @Redirect()
  initiateDiscordOAuth(@Res() res: Response) {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URL)}&response_type=code&scope=identify`;
  res.redirect(discordAuthUrl);
}

  @Get('callback')
  async handleDiscordOAuthCallback(
    @Query('code') code: string,
    @Query('pubkey') pubkey: string,
    @Res() res: Response) {
    const data = await this.discordAuthService.authUser(code, pubkey, res);

    return { url: data };
  }

  @Get('user')
  async getUser(@Query('token') token: string) {
    try {
      const decoded = jwt.verify(token, 'secretKey');
      const discordUserUrl = 'https://discord.com/api/users/@me';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Bearer ${token}`,
      };
      const userResponse = await axios.get(discordUserUrl, { headers });
      return userResponse.data;
    } catch (error) {
      this.logger.error(error);
      return { error: 'Invalid token' };
    }
  }

  @Get('logout')
  async logout(@Query('token') token: string) {
    try {
      jwt.verify(token, 'secretKey');
      return { message: 'Logged out' };
    } catch (error) {
      this.logger.error(error);
      return { error: 'Invalid token' };
    }
  }
   
}
