import { BN } from 'bn.js';
import { bignumber } from 'mathjs';
import { InitMachineRequestDto } from '../dto/init-machine.dto';
import {
  keypairIdentity,
  sol,
  toBigNumber,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { PublicRemint } from '../entity/public-remint.entity';
import { BadRequestException } from '@nestjs/common';
import { PublicRemintRepository } from '../repository/public-remint.repository';
import { metaplex, RPC_CONNECTION } from 'src/utilities/solana/utilities';

export class InitCandyMachine {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}
  async execute(initRequestDto: InitMachineRequestDto) {
    try {
      const nfts = await this.publicRemintRepo.getNonMintedNfts(
        initRequestDto.firstCreator,
      );
      const kp = Keypair.generate();
      const airdrop = await RPC_CONNECTION.requestAirdrop(
        kp.publicKey,
        1 * LAMPORTS_PER_SOL,
      );
      await RPC_CONNECTION.confirmTransaction(airdrop);
      metaplex.use(keypairIdentity(kp));
      const candyMachine = Keypair.generate();
      const initIx = await metaplex.candyMachinesV2().create({
        wallet: new PublicKey(initRequestDto.wallet),
        creators: [
          {
            address: new PublicKey(initRequestDto.wallet),
            share: 100,
            verified: true,
          },
        ],
        sellerFeeBasisPoints: initRequestDto.sellerFeeBps,
        candyMachine: {
          publicKey: candyMachine.publicKey,
          secretKey: candyMachine.secretKey,
        },
        retainAuthority: true,
        symbol: initRequestDto.symobl,
        collection: new PublicKey(initRequestDto.collection),
        itemsAvailable: toBigNumber(nfts.length),
        price: sol(initRequestDto.price),
      });
      const loadedIx = await this.insertItems(
        nfts,
        nfts.length,
        candyMachine.publicKey.toString(),
      );
      return { initIx: initIx.response, loadIx: loadedIx };
    } catch (error) {
      throw new BadRequestException(
        'Failed to initialize candy machine:',
        error.message,
      );
    }
  }

  async insertItems(
    nfts: PublicRemint[],
    itemsAvailable: number,
    candyMachine: string,
  ) {
    let itemsLoaded = 0;
    const ix = await metaplex.candyMachinesV2().insertItems({
      candyMachine: {
        address: new PublicKey(candyMachine),
        itemsAvailable: toBigNumber(itemsAvailable),
        itemsLoaded: toBigNumber(itemsLoaded),
      },
      items: nfts.map((nft) => {
        return {
          name: nft.name,
          uri: nft.uri,
        };
      }),
    });
    return ix;
  }
}
