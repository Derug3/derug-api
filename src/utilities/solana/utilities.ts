import { Metaplex } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv';
const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

export const RPC_CONNECTION = new Connection(CONNECTION_URL);
export const metaplex = Metaplex.make(RPC_CONNECTION);
