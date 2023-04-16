import { decode } from '@project-serum/anchor/dist/cjs/utils/bytes/hex';
import { Keypair, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import {
  Metaplex,
  createCandyMachineV2Builder,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { RPC_CONNECTION } from './solana/utilities';
import * as dotenv from 'dotenv';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { DerugProgram, IDL } from '../solana/derug_program';
import Client, { auth } from 'twitter-api-sdk';
import { REDIRECT, TWITTER_AUTH } from './constants';
import TwitterApi from 'twitter-api-v2';
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
const appEndpoint = process.env.BASE_ENDPOINT!;

export const twitterApi = new TwitterApi({
  clientId: cliendId,
  clientSecret: clientSecret,
});

export const oauthConfig = new auth.OAuth2User({
  client_id: cliendId,
  client_secret: clientSecret,
  callback: `${appEndpoint}${TWITTER_AUTH}${REDIRECT}`,
  scopes: ['users.read', 'tweet.read'],
});

export const twitterClient = new Client(
  'AAAAAAAAAAAAAAAAAAAAAO4fmAEAAAAAt%2B%2F8X08iFLb76DhZ6c3KFYxK3K0%3DZ6qq7NdyvS53c2X5iPCWwRzI6hrsjjIiwtBlBVslYjDgy7X6VT',
);
