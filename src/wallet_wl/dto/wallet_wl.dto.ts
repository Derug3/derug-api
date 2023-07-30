import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum WlType {
  Token,
  AllowList,
}

export class WalletWlDto {
  @IsString()
  derugAddress: string;
  @IsString()
  derugger: string;
  @IsString()
  signedMessage: string;
  @IsOptional()
  @IsNumber()
  duration: number;
  @IsString()
  serverId: string;
}
