import { Injectable } from '@nestjs/common';
import { CreateUserMintDto } from './dto/create-user-mint.dto';
import { UserMintRepository } from './repository/repository';

@Injectable()
export class UserMintService {
  constructor(private readonly userMintRepo: UserMintRepository) {}

  saveUserMint(userMint: CreateUserMintDto) {
    return this.userMintRepo.storeUserMint(
      userMint.userPubkey,
      userMint.candyMachinePubkey,
    );
  }

  async getUserMints(userMintDto: CreateUserMintDto) {
    const userMints = await this.userMintRepo.getUserMints(
      userMintDto.userPubkey,
      userMintDto.candyMachinePubkey,
    );
    if (!userMints) {
      return [];
    }
    return userMints;
  }
}
