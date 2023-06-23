import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { Request, Response } from 'express';
import { frontEndpoint } from 'src/utilities/utils';
import { COLLECTION, DERUG, SYMBOL } from 'src/utilities/constants';

@Controller('twitter-auth')
export class TwitterAuthController {
  constructor(private readonly twitterAuthService: TwitterAuthService) {}

  @Get('/redirect')
  async redirectedUser(
    @Res() res: Response,
    @Query('code') code: string,
    @Query('pubkey') pubkey: string,
  ) {
    await this.twitterAuthService.fetchUserTwitterData(code, pubkey);

    res.redirect(frontEndpoint);
  }

  @Get('/:pubkey')
  async makeOauth2Request(@Param('pubkey') pubkey: string) {
    const data = await this.twitterAuthService.authUser(pubkey);

    return { url: data };
  }

  @Get('pubkey/:pubkey')
  getUserTwitterDataByPubkey(@Param('pubkey') pubkey: string) {
    return this.twitterAuthService.getUserTwitterByPubkey(pubkey);
  }

  @Delete('pubkey/:pubkey')
  deleteUserTwitterData(@Param('pubkey') pubkey: string) {
    return this.twitterAuthService.unlinkUserTwitter(pubkey);
  }
}
