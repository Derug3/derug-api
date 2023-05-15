import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserMintService } from './user-mint.service';
import { CreateUserMintDto } from './dto/create-user-mint.dto';

@Controller('user-mint')
export class UserMintController {
  constructor(private readonly userMintService: UserMintService) {}

  @Post('/save')
  saveUserMint(@Body() userMint: CreateUserMintDto) {
    return this.userMintService.saveUserMint(userMint);
  }

  @Get('/get/:candyMachine/:userPubkey')
  getUserMints(
    @Param('candyMachine') candyMachine: string,
    @Param('userPubkey') userPubkey: string,
  ) {
    return this.userMintService.getUserMints({
      candyMachinePubkey: candyMachine,
      userPubkey,
    });
  }
}
