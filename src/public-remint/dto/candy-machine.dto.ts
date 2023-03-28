import { IsString } from 'class-validator';

export class CandyMachineDto {
  @IsString()
  derugData: string;

  @IsString()
  candyMachine: string;

  @IsString()
  candyMachineSecretKey: string;
}
