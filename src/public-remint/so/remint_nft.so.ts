import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  Transaction,
} from '@solana/web3.js';
import { decode } from 'bs58';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { derugProgram, metadataUploader } from 'src/utilities/utils';
import { RemintDto } from '../dto/remint.dto';
import { AuthorityRepository } from '../repository/authority.repository.impl';

export class RemintNft {
  constructor(private readonly authorityRepo: AuthorityRepository) {}
  async execute(remint: RemintDto) {
    let result:
      | { mint: string; succeded: boolean; message?: string }
      | undefined;

    const transaction = Transaction.from(JSON.parse(remint.signedTx).data);
    const instructionsWithoutCb = transaction.instructions.filter(
      (ix) =>
        ix.programId.toString() !== ComputeBudgetProgram.programId.toString(),
    );
    const mint = instructionsWithoutCb[0].keys[7].pubkey.toString();
    try {
      try {
        const authority = await this.authorityRepo.findOne({
          where: { derugData: remint.derugData },
        });

        if (!authority) throw new NotFoundException('Authority not found!');

        const connection = new Connection(heliusRpc);

        const auth = Keypair.fromSecretKey(decode(authority.secretKey));

        transaction.partialSign(auth);

        const txSim = await connection.simulateTransaction(transaction);

        console.log(txSim.value.logs);

        const txSig = await connection.sendRawTransaction(
          transaction.serialize(),
        );
        await connection.confirmTransaction(txSig);

        console.log('EXECUTED');

        result = { mint, succeded: true };
      } catch (error) {
        console.log('FAILED', error);

        result = { mint, succeded: true, message: error.message };
      }
    } catch (error) {
      console.log('FAILED', error);

      result = { mint, succeded: true, message: error.message };
    }
  }
}
