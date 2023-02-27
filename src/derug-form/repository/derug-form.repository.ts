import { DerugRequestDto } from '../dto/derug-requests.dto';
import { DerugDto } from '../dto/derug.dto';

export abstract class DerugRepository {
  abstract saveDerugRequest(): Promise<DerugDto>;
  abstract getRequestsByCollection(
    collection: string,
  ): Promise<DerugRequestDto>;
}
