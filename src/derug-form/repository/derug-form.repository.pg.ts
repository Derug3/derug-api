import { AbstractRepository } from 'typeorm';
import { DerugRequestDto } from '../dto/derug-requests.dto';
import { DerugDto } from '../dto/derug.dto';
import { DerugForm } from '../entity/derug-form.entity';
import { DerugRepository } from './derug-form.repository';

export class PgDerugFormRepository
  extends AbstractRepository<DerugForm>
  implements DerugRepository
{
  getRequestBasicData(collection: string): Promise<DerugForm> {
    return this.repository.findOne({ where: { collectionKey: collection } });
  }
  saveDerugRequest(request: DerugForm): Promise<DerugForm> {
    return this.repository.save(request);
  }
  getRequestsByCollection(collection: string): Promise<DerugForm> {
    return this.repository.findOne({
      where: { collectionKey: collection },
      relations: ['userRequests'],
    });
  }
}
