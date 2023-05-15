import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserMintService } from './user-mint.service';
import { CreateUserMintDto } from './dto/create-user-mint.dto';

@Controller('user-mint')
export class UserMintController {
  constructor(private readonly userMintService: UserMintService) {}

  @Post('/save')
  saveUserMint(@Body() userMint: CreateUserMintDto) {
    return this.userMintService.saveUserMint(userMint);
  }

  @Get('/get')
  getUserMints(@Body() userMint: CreateUserMintDto) {
    return this.userMintService.getUserMints(userMint);
  }
}
