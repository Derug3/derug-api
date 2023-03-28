import { BadRequestException } from '@nestjs/common';
import { CandyMachineDto } from '../dto/candy-machine.dto';
import { CandyMachineData } from '../entity/candy-machine.entity';
import { CandyMachineRepository } from '../repository/candy-machine.repository';

export class SaveCandyMachine {
  constructor(private readonly candyMachineRepo: CandyMachineRepository) {}
  async execute(candyMachineDto: CandyMachineDto) {
    try {
      const candyMachineData = new CandyMachineData();
      const { candyMachine, candyMachineSecretKey, derugData } =
        candyMachineDto;
      candyMachineData.candyMachineKey = candyMachine;
      candyMachineData.candyMachineSecretKey = candyMachineSecretKey;
      candyMachineData.derugData = derugData;
      await this.candyMachineRepo.storeCandyMachineData(candyMachineData);
    } catch (error) {
      throw new BadRequestException(
        'Failed to store candy machine data:',
        error.message,
      );
    }
  }
}
