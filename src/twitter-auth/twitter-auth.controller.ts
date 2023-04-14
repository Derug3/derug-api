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
    @Query('state') state: string,
  ) {
    const splittedData = state.split('!');
    await this.twitterAuthService.fetchUserTwitterData(code, splittedData[1]);
    if (splittedData[0] !== '') {
      res.redirect(
        `${frontEndpoint}/${COLLECTION}?${SYMBOL}=${splittedData[0]}&${DERUG}=true`,
      );
    } else {
      res.redirect(frontEndpoint);
    }
  }

  @Get('/:collectionSlug')
  async makeOauth2Request(@Param('collectionSlug') collectionSlug: string) {
    const data = await this.twitterAuthService.authUser(collectionSlug);

    console.log(data);

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
