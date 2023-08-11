import { IsString } from 'class-validator';

export class RemintDto {
  @IsString()
  signedTx: any;
  @IsString()
  derugData: string;
  @IsString()
  signedVerifyTx: string;
}

export class MintFromCandyMachineDto {
  @IsString()
  signedTx: any;
  @IsString()
  derugData: string;
}
