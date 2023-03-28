import { decode } from '@project-serum/anchor/dist/cjs/utils/bytes/hex';
import { Keypair, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Metaplex, createCandyMachineV2Builder } from '@metaplex-foundation/js';
import { RPC_CONNECTION } from './solana/utilities';
import * as dotenv from 'dotenv';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { DerugProgram, IDL } from '../solana/derug_program';
dotenv.config();
export function checkIfMessageIsSigned(
  signedMessage: string | undefined,
  message: string,
  pubKey: string,
) {
  if (!signedMessage) return false;

  try {
    const publicKey = new PublicKey(pubKey);
    const messageBytes = new TextEncoder().encode(message);

    const isOwner = nacl.sign.detached.verify(
      messageBytes,
      decode(signedMessage),
      publicKey.toBytes(),
    );

    if (!isOwner) return false;
    return true;
  } catch (error) {
    return false;
  }
}

export const mpx = new Metaplex(RPC_CONNECTION);

const PROGRAM_ID = process.env.SOLANA_PROGRAM as string;

export const derugProgram = new Program<DerugProgram>(
  IDL,
  new PublicKey(PROGRAM_ID),
  new AnchorProvider(RPC_CONNECTION, new Wallet(Keypair.generate()), {
    commitment: 'confirmed',
  }),
);
