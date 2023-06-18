import { decode } from '@project-serum/anchor/dist/cjs/utils/bytes/hex';
import { Keypair, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import {
  Metaplex,
  createCandyMachineV2Builder,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { TwitterApi } from 'twitter-api-v2';
import { RPC_CONNECTION } from './solana/utilities';
import * as dotenv from 'dotenv';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { DerugProgram, IDL } from '../solana/derug_program';
import Client, { auth } from 'twitter-api-sdk';
import { REDIRECT, TWITTER_AUTH } from './constants';
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

//TODO:Fix this before mainnet
export const mpx = new Metaplex(RPC_CONNECTION).use(
  bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
  }),
);

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
  new AnchorProvider(RPC_CONNECTION, new Wallet(Keypair.generate()), {
    commitment: 'confirmed',
  }),
);

const cliendId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET_ID!;

export const v2Client = new TwitterApi({
  clientId: cliendId,
  clientSecret: clientSecret,
});
