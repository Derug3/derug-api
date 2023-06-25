import { bundlrStorage, Metaplex, Signer } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { metadataUploader } from '../utils';
const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

dotenv.config();
//TODO:load from env
export const RPC_CONNECTION = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=05a3a206-18c8-492f-bc34-9bff0beccaf2',
);

export const metaplex = new Metaplex(RPC_CONNECTION).use(bundlrStorage());

export const graphQLClient = new GraphQLClient(
  'https://graphql.tensor.trade/graphql',
);

export const heliusMetadataEndpoint = process.env.HELIUS_METADATA_RPC!;

export const heliusMintlistEndpoint = process.env.HELIUS_MINTLIST_RPC!;

//TODO:change
export const shadowDrive = new PublicKey(
  'GWU2E9FNs6RyztkE7yWumMtVg3Xdvop4T6AKdJRT5WLJ',
);

export const storageUrl =
  'https://shdw-drive.genesysgo.net/GWU2E9FNs6RyztkE7yWumMtVg3Xdvop4T6AKdJRT5WLJ/';
