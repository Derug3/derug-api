import { decode } from '@project-serum/anchor/dist/cjs/utils/bytes/hex';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';

import { TwitterApi } from 'twitter-api-v2';

import * as dotenv from 'dotenv';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { DerugProgram, IDL } from '../solana/derug_program';
import Client, { auth } from 'twitter-api-sdk';
import { REDIRECT, TWITTER_AUTH } from './constants';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

dotenv.config();
export function checkIfMessageIsSigned(
  signedMessage: string | undefined,
  message: string,
  pubKey: string,
) {
  if (!signedMessage) return false;

  try {
    const publicKey = new PublicKey(pubKey);

    const isOwner = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signedMessage),
      publicKey.toBytes(),
    );

    if (!isOwner) return false;
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

const PROGRAM_ID = process.env.SOLANA_PROGRAM as string;

export const redirectUri = `${process.env.BASE_ENDPOINT}/${TWITTER_AUTH}/${REDIRECT}`;

const METADATA_UPLOADER_KEYPAIR = process.env
  .METADATA_UPLOADER_KEYPAIR as string;

export const metadataUploader = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(METADATA_UPLOADER_KEYPAIR)),
);

export const frontEndpoint = process.env.FRONT_ENDPOINT as string;

export const derugProgram = new Program<DerugProgram>(
  IDL,
  new PublicKey(PROGRAM_ID),
  new AnchorProvider(
    new Connection(process.env.HELIUS_RPC, { commitment: 'confirmed' }),
    new Wallet(Keypair.generate()),
    {
      commitment: 'confirmed',
    },
  ),
);

const cliendId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET_ID!;

export const v2Client = new TwitterApi({
  clientId: cliendId,
  clientSecret: clientSecret,
});
