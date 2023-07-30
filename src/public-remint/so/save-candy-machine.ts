import { BadRequestException } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import { CandyMachineData } from '../entity/candy-machine.entity';
import { CandyMachineRepository } from '../repository/candy-machine.repository';
import { encode } from 'bs58';

export class SaveCandyMachine {
  constructor(private readonly candyMachineRepo: CandyMachineRepository) {}
  async execute(derugData: string) {
    try {
      const candyMachineData = new CandyMachineData();
      const candyMachine = Keypair.generate();
      const encodedKey = encode(candyMachine.secretKey);
      candyMachineData.candyMachineKey = candyMachine.publicKey.toString();
      candyMachineData.candyMachineSecretKey = encodedKey;
      candyMachineData.derugData = derugData;
      await this.candyMachineRepo.storeCandyMachineData(candyMachineData);
      return { message: 'Data Saved' };
    } catch (error) {
      throw new BadRequestException(
        'Failed to store candy machine data:',
        error.message,
      );
    }
  }
}
