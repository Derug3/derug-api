import { AbstractRepository, EntityRepository } from 'typeorm';
import { CandyMachineData } from '../entity/candy-machine.entity';
import { CandyMachineRepository } from './candy-machine.repository';

@EntityRepository(CandyMachineData)
export class CandyMachineDataPgRepository
  extends AbstractRepository<CandyMachineData>
  implements CandyMachineRepository
{
  get(derugData: string): Promise<CandyMachineData> {
    return this.repository.findOne({ where: { derugData } });
  }
  storeCandyMachineData(
    candyMachine: CandyMachineData,
  ): Promise<CandyMachineData> {
    return this.repository.save(candyMachine);
  }
  getCandyMachineData(derugData: string): Promise<CandyMachineData> {
    return this.repository.findOne({ where: { derugData: derugData } });
  }
}
