import { decode } from '@project-serum/anchor/dist/cjs/utils/bytes/hex';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Metaplex, createCandyMachineV2Builder } from '@metaplex-foundation/js';
import { RPC_CONNECTION } from './solana/utilities';

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
