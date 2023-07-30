import { chunk, keypairIdentity, MetaplexFile } from '@metaplex-foundation/js';
import { BadRequestException, Logger } from '@nestjs/common';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { remintConfigSeed } from 'src/utilities/constants';
import { heliusRpc, RPC_CONNECTION } from 'src/utilities/solana/utilities';

import { ShadowFile, ShdwDrive } from '@shadow-drive/sdk';
import { derugProgram, metadataUploader } from 'src/utilities/utils';
import { GetNftsByUpdateAuthority } from '../dto/candy-machine.dto';
import { PublicRemint } from '../entity/public-remint.entity';
import { PublicRemintRepository } from '../repository/public-remint.repository';
import { Wallet } from '@project-serum/anchor';

export class FetchAllNftsFromCollection {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}

  private logger = new Logger(FetchAllNftsFromCollection.name);

  async execute(
    creator: string,
    derugData: string,
    txData: GetNftsByUpdateAuthority,
  ) {
    try {
      let queryFinished = false;
      let nfts: PublicRemint[] = [];
      let paginationToken: string | undefined = undefined;
      let page = 1;
      let response: any;
      const derugRequest = await derugProgram.account.derugRequest.fetch(
        txData.derugRequest,
      );
      do {
        response = (
          await fetch(heliusRpc, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 'my-id',
              method: 'getAssetsByCreator',
              params: {
                creatorAddress: creator,
                onlyVerified: true,
                page: page,
                limit: 1000,
              },
            }),
          })
        ).json();
        page += 1;
        response.result.items.forEach((res) => {
          nfts.push({
            creator: creator,
            dateReminted: null,
            derugData: derugData,
            name: res.content.metadata.name,
            newName:
              derugRequest.newName +
              ' #' +
              res.content.metadata.name.split('#')[1],
            hasReminted: false,
            newSymbol: derugRequest.newSymbol,
            newUri: res.content.json_uri,
            uri: res.content.json_uri,
            mint: res.id,
            remintAuthority: derugRequest.derugger.toString(),
          });
        });
      } while (response.result.items.length > 0);

      this.logger.log(`Fetched ${nfts.length} NFTs from Metadata program`);

      const reminted = (
        await derugProgram.account.remintProof.all([
          {
            memcmp: {
              offset: 8,
              bytes: new PublicKey(derugData).toBase58(),
            },
          },
        ])
      ).map((nft) => nft.account.oldMint.toString());

      this.logger.log(`Fetched total reminted ${reminted.length} NFTs`);

      nfts = nfts.filter((nft) => !reminted.includes(nft.mint));

      this.logger.log(`Collection with ${nfts.length} NFTs aftrer filtering!`);

      const files: ShadowFile[] = [];
      const failed: string[] = [];

      const existingMetadata = await this.publicRemintRepo.getNonMintedNfts(
        derugData,
      );

      if (existingMetadata.length === 0) {
        await this.publicRemintRepo.storeAllCollectionNfts(nfts);
      }

      this.logger.debug(`Stored data for Derug Data:${derugData}`);
      await this.initPrivateMint(
        new PublicKey(derugData),
        new PublicKey(txData.derugRequest),
      );
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Failed to fetch all NFTs from rugged collection.',
      );
    }
  }

  mapNftToRemintData(
    nft: any,
    derugData: string,
    newName: string,
    newSymbol: string,
    newUri: string,
  ) {
    const remintData = new PublicRemint();

    remintData.dateReminted = null;
    remintData.hasReminted = false;
    remintData.name = nft.onChainMetadata.metadata.data.name;
    remintData.mint = nft.onChainMetadata.metadata.mint;
    remintData.remintAuthority = null;
    remintData.uri = nft.onChainMetadata.metadata.data.uri;
    remintData.creator = '';
    remintData.derugData = derugData;
    remintData.newName = newName;
    remintData.newUri = newUri;
    remintData.newSymbol = newSymbol;

    return remintData;
  }

  async initPrivateMint(derugData: PublicKey, derugRequest: PublicKey) {
    try {
      const [remintConfig] = PublicKey.findProgramAddressSync(
        [remintConfigSeed, derugData.toBuffer()],
        derugProgram.programId,
      );

      const ix = await derugProgram.methods
        .initPrivateMint()
        .accounts({
          derugData,
          derugRequest,
          payer: metadataUploader.publicKey,
        })
        .instruction();

      const txMessage = new TransactionMessage({
        instructions: [ix],
        payerKey: metadataUploader.publicKey,
        recentBlockhash: (await RPC_CONNECTION.getLatestBlockhash()).blockhash,
      }).compileToV0Message();
      const versionedTx = new VersionedTransaction(txMessage);
      versionedTx.sign([metadataUploader]);
      const txSig = await RPC_CONNECTION.sendRawTransaction(
        versionedTx.serialize(),
      );
      await RPC_CONNECTION.confirmTransaction(txSig);
    } catch (error) {
      console.log(error);
    }
  }
}
