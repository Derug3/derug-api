import { bundlrStorage, Metaplex, Signer } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { metadataUploader } from '../utils';
const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

dotenv.config();
//TODO:load from env
export const RPC_CONNECTION = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=88368c93-dc7e-4637-9328-46fc7a414549',
);

export const metaplex = new Metaplex(RPC_CONNECTION).use(bundlrStorage());

export const graphQLClient = new GraphQLClient(
  'https://graphql.tensor.trade/graphql',
);

export const heliusMetadataEndpoint = process.env.HELIUS_METADATA_RPC!;

export const heliusMintlistEndpoint = process.env.HELIUS_MINTLIST_RPC!;

//TODO:change
export const shadowDrive = new PublicKey(
  'AdCwAc5Hcubbog6wAxcsMVUZKfwNqAmfmgiP8GsFYvkw',
);

export const storageUrl =
  'https://shdw-drive.genesysgo.net/AdCwAc5Hcubbog6wAxcsMVUZKfwNqAmfmgiP8GsFYvkw/';
