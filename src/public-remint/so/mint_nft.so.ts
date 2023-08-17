import { Logger } from '@nestjs/common';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  Transaction,
} from '@solana/web3.js';
import { decode } from 'bs58';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { MintFromCandyMachineDto } from '../dto/remint.dto';
import { AuthorityRepository } from '../repository/authority.repository.impl';

export class MintNft {
  constructor(private readonly authorityRepo: AuthorityRepository) {}

  logger = new Logger(MintNft.name);

  async execute(mintNftDto: MintFromCandyMachineDto) {
    try {
      this.logger.log('Started minting');
      const authorityData = await this.authorityRepo.findOne({
        where: { derugData: mintNftDto.derugData },
      });
      if (!authorityData) {
        return { code: 400, message: 'Missing authority!' };
      }
      const transaction = Transaction.from(
        JSON.parse(mintNftDto.signedTx).data,
      );

      const authority = Keypair.fromSecretKey(decode(authorityData.secretKey));

      transaction.partialSign(authority);

      const filteredInstructions = transaction.instructions.filter(
        (ix) => !ix.programId.equals(ComputeBudgetProgram.programId),
      );

      if (filteredInstructions.length > 2) {
        return { code: 400, message: 'Invalid instructions amount!' };
      }

      const connection = new Connection(heliusRpc, 'confirmed');

      const txSig = await connection.sendRawTransaction(
        transaction.serialize(),
      );

      await connection.confirmTransaction(txSig);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const nftMint = filteredInstructions[0].keys[7].pubkey;
      this.logger.log('Minted');
      return {
        code: 200,
        message: 'Succesffully minted',
        mint: nftMint.toString(),
      };
    } catch (error) {
      console.log(error);

      return { code: 500, message: error.message };
    }
  }
}
