import { BadRequestException } from '@nestjs/common';
import { ComputeBudgetProgram, Connection, Transaction } from '@solana/web3.js';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { derugProgram, metadataUploader } from 'src/utilities/utils';
import { RemintDto } from '../dto/remint.dto';

export class RemintNft {
  async execute(remint: RemintDto) {
    let result:
      | { mint: string; succeded: boolean; message?: string }
      | undefined;

    const transaction = Transaction.from(remint.signedTx.data);
    const instructionsWithoutCb = transaction.instructions.filter(
      (ix) =>
        ix.programId.toString() !== ComputeBudgetProgram.programId.toString(),
    );
    const mint = instructionsWithoutCb[0].keys[7].pubkey.toString();
    try {
      if (transaction.instructions.length > 0) {
        throw new Error('Invalid instructions length!');
      }
      if (
        transaction.instructions[0].programId.toString() !==
        derugProgram.programId.toString()
      ) {
        throw new Error('Invalid program id!');
      }

      transaction.sign(metadataUploader);

      const connection = new Connection(heliusRpc);

      const txSim = await connection.simulateTransaction(transaction);

      console.log(txSim.value.logs);

      const txSig = await connection.sendRawTransaction(
        transaction.serialize(),
      );
      const confirmed = await connection.confirmTransaction(txSig);

      result = { mint, succeded: true };
    } catch (error) {
      result = { mint, succeded: true, message: error.message };
    }
  }
}
