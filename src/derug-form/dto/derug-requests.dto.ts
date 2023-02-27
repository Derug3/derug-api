import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class DerugRequestDto {
  @IsString()
  collection: string;

  @IsDate()
  dateCreated: Date;

  @IsDate()
  lastRequest: Date;

  @IsArray()
  userRequests: UserDerugRequestDto[];
}

export class UserDerugRequestDto {
  @IsNumber()
  nftsNumber: number;

  @IsString()
  userPubkey: string;

  @IsDate()
  dateStored: Date;
}
