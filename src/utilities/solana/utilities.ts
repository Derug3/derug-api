import { bundlrStorage, Metaplex, Signer } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { metadataUploader } from '../utils';
const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

dotenv.config();
//TODO:load from env
export const RPC_CONNECTION = new Connection('https://api.devnet.solana.com');

export const metaplex = new Metaplex(RPC_CONNECTION).use(
  bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
  }),
);

export const graphQLClient = new GraphQLClient(
  'https://graphql.tensor.trade/graphql',
);

export const heliusMetadataEndpoint = process.env.HELIUS_METADATA_RPC!;

export const heliusMintlistEndpoint = process.env.HELIUS_MINTLIST_RPC!;
