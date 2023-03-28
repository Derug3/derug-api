import { IsString } from 'class-validator';

export class CandyMachineDto {
  @IsString()
  derugData: string;

  @IsString()
  candyMachineKey: string;

  @IsString()
  candyMachineSecretKey: string;
}
