import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { Request, Response } from 'express';
import { frontEndpoint } from 'src/utilities/utils';
import { COLLECTION, DERUG, SYMBOL } from 'src/utilities/constants';

@Controller('twitter-auth')
export class TwitterAuthController {
  constructor(private readonly twitterAuthService: TwitterAuthService) {}

  @Get('/redirect')
  redirectedUser(
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    this.twitterAuthService.fetchUserTwitterData(code);
    res.redirect(
      `${frontEndpoint}/${COLLECTION}?${SYMBOL}=${state}&${DERUG}=true`,
    );
  }

  @Get('/:collectionSlug')
  async makeOauth2Request(@Param('collectionSlug') collectionSlug: string) {
    const data = await this.twitterAuthService.authUser(collectionSlug);
    return { url: data };
  }
}
