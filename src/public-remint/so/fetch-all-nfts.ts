import { chunk, keypairIdentity } from '@metaplex-foundation/js';
import { BadRequestException, Logger } from '@nestjs/common';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { remintConfigSeed } from 'src/utilities/constants';
import {
  heliusMetadataEndpoint,
  heliusMintlistEndpoint,
  metaplex,
  RPC_CONNECTION,
} from 'src/utilities/solana/utilities';
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
      let queryFinished = false;
      const mints: string[] = [];
      let paginationToken: string | undefined = undefined;
      while (!queryFinished) {
        const respoonse = await fetch(heliusMintlistEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            query: {
              firstVerifiedCreators: [updateAuthority],
            },
            options: {
              limit: 10000,
              paginationToken,
            },
          }),
        });
        const parsedResponse = await respoonse.json();

        if (!parsedResponse.paginationToken) {
          queryFinished = true;
        }
        paginationToken = parsedResponse.paginationToken;
        parsedResponse.result.forEach((mint) => mints.push(mint.mint));
      }
      let allNfts: any[] = [];
      const chunkedMints = chunk(mints, 100);
      for (const mintsChunk of chunkedMints) {
        const metadataList = await (
          await fetch(heliusMetadataEndpoint, {
            method: 'POST',
            body: JSON.stringify({
              mintAccounts: mintsChunk,
              includeOffChain: true,
            }),
          })
        ).json();

        metadataList.forEach((nft) => allNfts.push(nft));
      }
      this.logger.log(`Fetched ${allNfts.length} NFTs from Metadata program`);

      const derugDataAcc = await derugProgram.account.derugData.fetch(
        new PublicKey(derugData),
      );

      const derugRequest = await derugProgram.account.derugRequest.fetch(
        new PublicKey(txData.derugRequest),
      );

      // allNfts = allNfts.filter(
      //   (nft) =>
      //     nft.collection?.address.toString() ===
      //       derugDataAcc.collection.toString() ||
      //     nft.creators.find(
      //       (c) => c.address.toString() === derugDataAcc.collection.toString(),
      //     ),
      // );

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

      const failed: string[] = [];
      if (existingMetadata.length === 0) {
        const remintData: PublicRemint[] = [];
        for (const nft of allNfts) {
          if (!nft.onChainMetadata?.metadata) {
            failed.push(nft);
            continue;
          }

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

        metaplex.use(keypairIdentity(metadataUploader));

        const uploadFailed = await metaplex.storage().upload({
          contentType: 'application/json',
          buffer: Buffer.from(JSON.stringify(failed)),
          displayName: 'Failed NM',
          extension: '.json',
          tags: [],
          fileName: 'nice_mice',
          uniqueName: 'nice_mice',
        });

        this.logger.error(`Uploaded failed at ${uploadFailed}`);
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
    remintData.nftMetadata = nft.onChainMetadata.metadata.key;
    remintData.remintAuthority = null;
    remintData.uri = nft.onChainMetadata.metadata.data.uri;
    remintData.creator = '';
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
    nft: any,
  ) {
    try {
      metaplex.use(keypairIdentity(metadataUploader));

      this.logger.debug('Starting upload');

      const jsonNft = await (
        await fetch(nft.onChainMetadata?.metadata.data.uri)
      ).json();
      const newNftName = newName + ' #' + jsonNft.name?.split('#')[1];
      const data = {
        ...jsonNft,
        symbol: newSymbol,
        seller_fee_basis_points: sellerFeeBps,
        name: newNftName,
        external_url: 'https://derug.us',
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
