import { IsArray, IsDate, IsString } from 'class-validator';

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

export class UserDerugRequestDto {}
