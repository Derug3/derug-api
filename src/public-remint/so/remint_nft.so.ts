import { BadRequestException } from '@nestjs/common';
import { ComputeBudgetProgram, Connection, Transaction } from '@solana/web3.js';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { derugProgram, metadataUploader } from 'src/utilities/utils';
import { RemintDto } from '../dto/remint.dto';

export class RemintNft {
  async execute(remint: RemintDto) {
    const results: { mint: string; succeded: boolean; message?: string }[] = [];
    for (const tx of remint.signedTx) {
      const transaction = Transaction.from(tx.data);
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

        const txSig = await connection.sendRawTransaction(
          transaction.serialize(),
        );

        const confirmed = await connection.confirmTransaction(txSig);

        results.push({ mint, succeded: true });
      } catch (error) {
        results.push({ mint, succeded: true, message: error.message });
      }
    }
  }
}
