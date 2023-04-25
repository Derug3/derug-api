import { IsString } from 'class-validator';

export class CandyMachineDto {
  @IsString()
  derugData: string;

  @IsString()
  candyMachineKey: string;

  @IsString()
  candyMachineSecretKey: string;
}

export class GetNftsByUpdateAuthority {
  @IsString()
  updateAuthority: string;

  @IsString()
  derugData: string;

  @IsString()
  derugRequest: string;
}
