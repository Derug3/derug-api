import { IsString } from 'class-validator';

export class GetNftsByUpdateAuthority {
  @IsString()
  updateAuthority: string;

  @IsString()
  derugData: string;

  @IsString()
  derugRequest: string;
}
