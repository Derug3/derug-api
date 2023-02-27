import { DerugRequestDto } from '../dto/derug-requests.dto';
import { DerugDto } from '../dto/derug.dto';
import { DerugForm } from '../entity/derug-form.entity';

export abstract class DerugRepository {
  abstract saveDerugRequest(derugRequest: DerugForm): Promise<DerugForm>;
  abstract getRequestsByCollection(collection: string): Promise<DerugForm>;
  abstract getRequestBasicData(collection: string): Promise<DerugForm>;
}
