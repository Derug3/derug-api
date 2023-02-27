import { IsString } from 'class-validator';

export class DerugDto {
  @IsString()
  signMessage: string;

  @IsString()
  collectionKey: string;

  @IsString()
  userPubkey: string;
}
