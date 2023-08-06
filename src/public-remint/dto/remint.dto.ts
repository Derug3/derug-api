import { IsString } from 'class-validator';

export class RemintDto {
  @IsString()
  signedTx: any;
  @IsString()
  derugData: string;
}
