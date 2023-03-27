import { IsArray, IsNumber, IsString } from 'class-validator';
export class InitMachineDto {
  candyMachineKey: string;

  transactions: Buffer[];
}

export class InitMachineRequestDto {
  @IsString()
  firstCreator: string;
  @IsString()
  wallet: string;
  @IsString()
  collection: string;
  @IsNumber()
  price: number;
  @IsNumber()
  sellerFeeBps: number;
  @IsString()
  symobl: string;
}
