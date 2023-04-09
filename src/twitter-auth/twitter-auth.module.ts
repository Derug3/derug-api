import { Module } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { TwitterAuthController } from './twitter-auth.controller';

@Module({
  controllers: [TwitterAuthController],
  providers: [TwitterAuthService]
})
export class TwitterAuthModule {}
