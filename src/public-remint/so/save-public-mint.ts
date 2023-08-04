import { BadRequestException } from '@nestjs/common';
import { Keypair, PublicKey } from '@solana/web3.js';
import { CandyMachineData } from '../entity/candy-machine.entity';
import { CandyMachineRepository } from '../repository/candy-machine.repository';
import { encode } from 'bs58';
import { AuthorityRepository } from '../repository/authority.repository';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { derugProgram } from 'src/utilities/utils';

export class SavePublicMintData {
  constructor(
    private readonly candyMachineRepo: CandyMachineRepository,
    private readonly authorityRepo: AuthorityRepository,
    private readonly collectionService: MagicEdenCollectionsService,
  ) {}
  async execute(derugData: string) {
    try {
      const candyMachineData = new CandyMachineData();
      const candyMachine = Keypair.generate();
      const encodedKey = encode(candyMachine.secretKey);
      candyMachineData.candyMachineKey = candyMachine.publicKey.toString();
      candyMachineData.candyMachineSecretKey = encodedKey;
      candyMachineData.derugData = derugData;
      await this.candyMachineRepo.storeCandyMachineData(candyMachineData);
      const authority = await this.authorityRepo.storeAuthority(derugData);
      const derugDataAccount = await derugProgram.account.derugData.fetch(
        new PublicKey(derugData),
      );
      await this.collectionService.initCollectionDerug(derugDataAccount.slug);
      return { authority, candyMachine: candyMachine.publicKey.toString() };
    } catch (error) {
      throw new BadRequestException(
        'Failed to store candy machine data:',
        error.message,
      );
    }
  }
}
