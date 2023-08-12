import { bundlrStorage, Metaplex, Signer } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { decode } from 'bs58';
export const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

export const heliusRpc = process.env.HELIUS_RPC;

dotenv.config();

export const RPC_CONNECTION = new Connection(heliusRpc);

export const metaplex = new Metaplex(RPC_CONNECTION).use(bundlrStorage());

export const graphQLClient = new GraphQLClient(
  'https://graphql.tensor.trade/graphql',
);

export const magicEdneCheckUrl =
  'https://api-mainnet.magiceden.io/collection_flags/check/';

export const heliusMetadataEndpoint = process.env.HELIUS_METADATA_RPC!;

export const heliusMintlistEndpoint = process.env.HELIUS_MINTLIST_RPC!;

export const botUrl = process.env.BOT_URL!;

export const metaplexAuthorizationRules = new PublicKey(
  'eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9',
);

export function parseKeypair(secretKey: string) {
  const decoded = decode(secretKey);
  return Keypair.fromSecretKey(decoded);
}

export const railwayUrl = process.env.RAILWAY_URL!;

export const platformAuthority = 'DRG3YRmurqpWQ1jEjK8DiWMuqPX9yL32LXLbuRdoiQwt';
