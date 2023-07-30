import { IsString } from 'class-validator';

export class GetNftsByUpdateAuthority {
  @IsString()
  creator: string;

  @IsString()
  derugData: string;

  @IsString()
  derugRequest: string;
}
