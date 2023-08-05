import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CandyMachineData } from '../entity/candy-machine.entity';

@Injectable()
export class CandyMachineRepository
  extends Repository<CandyMachineData>
  implements CandyMachineRepository
{
  constructor(dataSource: DataSource) {
    super(CandyMachineData, dataSource.createEntityManager());
  }
  get(derugData: string): Promise<CandyMachineData> {
    return this.findOne({ where: { derugData } });
  }
  storeCandyMachineData(
    candyMachine: CandyMachineData,
  ): Promise<CandyMachineData> {
    return this.save(candyMachine);
  }
  getCandyMachineData(derugData: string): Promise<CandyMachineData> {
    return this.findOne({ where: { derugData: derugData } });
  }
}
