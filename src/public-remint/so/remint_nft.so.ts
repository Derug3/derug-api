import { BadRequestException } from '@nestjs/common';
import { Connection, Transaction } from '@solana/web3.js';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { derugProgram, metadataUploader } from 'src/utilities/utils';
import { RemintDto } from '../dto/remint.dto';

export class RemintNft {
  async execute(remint: RemintDto) {
    try {
      const transaction = Transaction.from(remint.signedTx.data);
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

      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
