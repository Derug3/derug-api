import { IsString } from 'class-validator';

export class CreateUserMintDto {
  @IsString()
  userPubkey: string;

  @IsString()
  candyMachinePubkey: string;
}
