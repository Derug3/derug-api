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
}
