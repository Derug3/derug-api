import {
  JsonMetadata,
  keypairIdentity,
  Metadata,
  Nft,
  Sft,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import {} from '@metaplex-foundation/mpl-token-metadata';
import { BadRequestException, Logger } from '@nestjs/common';
import { Wallet } from '@project-serum/anchor';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { remintConfigSeed } from 'src/utilities/constants';
import { metaplex, RPC_CONNECTION } from 'src/utilities/solana/utilities';
import { derugProgram, metadataUploader, mpx } from 'src/utilities/utils';
import { GetNftsByUpdateAuthority } from '../dto/candy-machine.dto';
import { PublicRemint } from '../entity/public-remint.entity';
import { PublicRemintRepository } from '../repository/public-remint.repository';

export class FetchAllNftsFromCollection {
  constructor(private readonly publicRemintRepo: PublicRemintRepository) {}

  private logger = new Logger(FetchAllNftsFromCollection.name);

  async execute(
    updateAuthority: string,
    derugData: string,
    txData: GetNftsByUpdateAuthority,
  ) {
    try {
      let allNfts = await mpx.nfts().findAllByUpdateAuthority({
        updateAuthority: new PublicKey(updateAuthority),
      });

      this.logger.log(`Fetched ${allNfts.length} NFTs from Metadata program`);

      const derugDataAcc = await derugProgram.account.derugData.fetch(
        new PublicKey(derugData),
      );

      const derugRequest = await derugProgram.account.derugRequest.fetch(
        new PublicKey(txData.derugRequest),
      );

      allNfts = allNfts.filter(
        (nft) =>
          nft.collection?.address.toString() ===
            derugDataAcc.collection.toString() ||
          nft.creators.find(
            (c) => c.address.toString() === derugDataAcc.collection.toString(),
          ),
      );

      this.logger.log(
        `Collection with ${allNfts.length} NFTs aftrer filtering!`,
      );

      const sortedRequests = derugDataAcc.activeRequests.sort(
        (a, b) => a.voteCount - b.voteCount,
      );

      if (derugRequest.voteCount < sortedRequests[0].voteCount) {
        throw new BadRequestException('Given derug request is not winning!');
      }

      const existingMetadata = await this.publicRemintRepo.getNonMintedNfts(
        derugData,
      );

      if (existingMetadata.length === 0) {
        const remintData: PublicRemint[] = [];
        for (const nft of allNfts) {
          const nftData = await this.parseJsonMetadata(
            derugRequest.newName,
            derugRequest.newSymbol,
            derugRequest.sellerFeeBps,
            derugRequest.creators.map((c) => {
              return {
                address: c.address.toBase58(),
                share: c.share,
              };
            }),

            nft,
          );
          if (nftData && nftData.name && nftData.uri) {
            remintData.push(
              this.mapNftToRemintData(
                nft,
                derugData,
                nftData.name,
                derugRequest.newSymbol,
                nftData.uri,
              ),
            );
          }
        }
        await this.publicRemintRepo.storeAllCollectionNfts(remintData);
      }
      this.logger.debug(`Stored data for Derug Data:${derugData}`);
      await this.initPrivateMint(
        new PublicKey(derugData),
        new PublicKey(derugRequest),
      );
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Failed to fetch all NFTs from rugged collection.',
      );
    }
  }

  mapNftToRemintData(
    nft: Metadata<JsonMetadata<string>> | Nft | Sft,
    derugData: string,
    newName: string,
    newSymbol: string,
    newUri: string,
  ) {
    const remintData = new PublicRemint();

    remintData.dateReminted = null;
    remintData.hasReminted = false;
    remintData.name = nft.name;
    remintData.nftMetadata = nft.address.toString();
    remintData.remintAuthority = null;
    remintData.uri = nft.uri;
    remintData.creator = nft.creators[0].address.toString();
    remintData.derugData = derugData;
    remintData.newName = newName;
    remintData.newUri = newUri;
    remintData.newSymbol = newSymbol;

    return remintData;
  }

  async parseJsonMetadata(
    newName: string,
    newSymbol: string,
    sellerFeeBps: number,
    creators: { address: string; share: number }[],
    nft: Metadata<JsonMetadata<string>> | Nft | Sft,
  ) {
    try {
      metaplex.use(keypairIdentity(metadataUploader));

      const nftData = await (await fetch(nft.uri)).json();

      const newNftName = newName + ' #' + nftData.name.split('#')[1];
      const data = {
        ...nftData,
        symbol: newSymbol,
        seller_fee_basis_points: sellerFeeBps,
        name: newNftName,
        external_url: '',
        creators: creators.map((c) => {
          return {
            address: c.address.toString(),
            share: c.share,
          };
        }),
      };

      if (data.collection) {
        data.collection.name = newName;
      }

      const uploaded = await metaplex.nfts().uploadMetadata(data);

      this.logger.verbose(
        `Uploaded metadata on path:${uploaded.uri} with name: ${uploaded.metadata.name}`,
      );

      return {
        uri: uploaded.uri,
        name: newNftName,
      };
    } catch (error) {
      console.log('Failed to upload metadata for NFT', error);
    }
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
          remintConfig,
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
