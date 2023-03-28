import { BadRequestException } from '@nestjs/common';
import { CandyMachineRepository } from '../repository/candy-machine.repository';

export class GetCandyMachineData {
  constructor(private readonly candyMachineRepo: CandyMachineRepository) {}
  execute(derugData: string) {
    try {
      return this.candyMachineRepo.getCandyMachineData(derugData);
    } catch (error) {
      throw new BadRequestException(
        'Failed to find CandyMachine data by DerugData',
      );
    }
  }
}
