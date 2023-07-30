import { IsArray, IsNumber, IsString } from 'class-validator';
export class InitMachineDto {
  candyMachineKey: string;

  transactions: Buffer[];
}

export class InitMachineRequestDto {
  @IsString()
  derugData: string;
  @IsString()
  payer: string;
  @IsString()
  signedMessage: string;
}
