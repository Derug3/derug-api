import { Metaplex } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
import * as dotenv from 'dotenv';
const CONNECTION_URL = process.env.SOLANA_ENDPOINT as string;

dotenv.config();
export const RPC_CONNECTION = new Connection('https://api.devnet.solana.com');
export const metaplex = Metaplex.make(RPC_CONNECTION);
