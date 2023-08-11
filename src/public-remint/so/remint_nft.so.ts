import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  Transaction,
} from '@solana/web3.js';
import { decode } from 'bs58';
import { heliusRpc } from 'src/utilities/solana/utilities';
import { RemintDto } from '../dto/remint.dto';
import { AuthorityRepository } from '../repository/authority.repository.impl';
import { PublicRemintRepository } from '../repository/public-remint.pg.repository';

export class RemintNft {
  constructor(
    private readonly authorityRepo: AuthorityRepository,
    private readonly publicMintRepo: PublicRemintRepository,
  ) {}
  async execute(remint: RemintDto) {
    let result: { mint: string; message?: string; code: number } | undefined;

    const transaction = Transaction.from(JSON.parse(remint.signedTx).data);

    const instructionsWithoutCb = transaction.instructions.filter(
      (ix) =>
        ix.programId.toString() !== ComputeBudgetProgram.programId.toString(),
    );
    const mint = instructionsWithoutCb[0].keys[5].pubkey.toString();
    const nft = await this.publicMintRepo.findOne({ where: { mint } });

    try {
      try {
        if (!nft)
          return { succeded: false, message: 'Given nft  not found!', mint };
        const authority = await this.authorityRepo.findOne({
          where: { derugData: remint.derugData },
        });

        if (!authority) {
          return {
            succeded: false,
            message: 'Authority  not found!',
            mint,
            code: 400,
          };
        }
        const connection = new Connection(heliusRpc);

        const auth = Keypair.fromSecretKey(decode(authority.secretKey));

        transaction.partialSign(auth);

        const txSig = await connection.sendRawTransaction(
          transaction.serialize(),
        );
        await connection.confirmTransaction(txSig);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        nft.dateReminted = new Date();
        nft.hasReminted = true;
        nft.remintAuthority = transaction.feePayer.toString();

        result = { mint, code: 200 };
        await this.publicMintRepo.save(nft);
      } catch (error) {
        result = { mint, message: error.message, code: 500 };
      }
    } catch (error) {
      result = { mint, message: error.message, code: 400 };
    }
    return result;
  }
}
