import { CandyMachineData } from '../entity/candy-machine.entity';

export abstract class CandyMachineRepository {
  abstract storeCandyMachineData(
    candyMachine: CandyMachineData,
  ): Promise<CandyMachineData>;
  abstract getCandyMachineData(derugData: string): Promise<CandyMachineData>;
  abstract get(derugData: string): Promise<CandyMachineData>;
}
