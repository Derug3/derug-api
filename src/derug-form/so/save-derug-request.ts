import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ForbiddenException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { metaplex, RPC_CONNECTION } from 'src/utilities/solana/utilities';
import { checkIfMessageIsSigned } from 'src/utilities/utils';
import { DerugDto } from '../dto/derug.dto';
import { DerugForm } from '../entity/derug-form.entity';
import { UserRequest } from '../entity/user-request.entity';
import { DerugRepository } from '../repository/derug-form.repository';

export class SaveDerugRequest {
  constructor(private readonly derugRequestRepository: DerugRepository) {}

  async execute(derugRequest: DerugDto): Promise<DerugDto> {
    let { collectionKey, signMessage, userPubkey } = derugRequest;

    if (
      !checkIfMessageIsSigned(
        signMessage,
        'Submitting new derug requst',
        userPubkey,
      )
    ) {
      throw new ForbiddenException('User did not sign message!');
    }

    const userRequestData = new UserRequest();
    userRequestData.lastRequest = new Date();
    userRequestData.userPubkey = userPubkey;
    try {
      const collectionMetadata = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: new PublicKey(collectionKey) });
      const collectionAccount = await RPC_CONNECTION.getAccountInfo(
        collectionMetadata,
      );
      const [metadata] = Metadata.deserialize(collectionAccount.data);
      const nfts = await metaplex.nfts().findAllByOwner({
        owner: new PublicKey(userPubkey),
      });
      if (metadata.collection) {
        collectionKey = metadata.collection.key.toString();
        userRequestData.collectionNftsCount = nfts.filter(
          (nft) => nft.collection.address.toString() === collectionKey,
        ).length;
      } else {
        collectionKey = metadata.data.creators[0].address.toString();
        userRequestData.collectionNftsCount = nfts.filter(
          (nft) =>
            nft.creators[0].address.toString() ===
            metadata.data.creators[0].address.toString(),
        ).length;
      }
    } catch (error) {
      userRequestData.collectionNftsCount = -1;
    }
    const foundDerugForm =
      await this.derugRequestRepository.getRequestsByCollection(collectionKey);
    if (!foundDerugForm) {
      const derugForm = new DerugForm();
      derugForm.dateCreated = new Date();
      derugForm.requestsCount = 1;

      derugForm.userRequests = [userRequestData];
      userRequestData.collection = derugForm;
      const savedDerugRequest =
        await this.derugRequestRepository.saveDerugRequest(derugForm);
      return {
        collectionKey: savedDerugRequest.collectionKey,
        userPubkey: userPubkey,
        signMessage,
      };
    } else {
      if (
        foundDerugForm.userRequests.find((req) => req.userPubkey === userPubkey)
      ) {
        throw new Error('User alredy submitted derug request!');
      }
      foundDerugForm.lastRequest = new Date();
      foundDerugForm.requestsCount += 1;
      foundDerugForm.userRequests.push(userRequestData);
      userRequestData.collection = foundDerugForm;

      const updatedDerugRequest =
        await this.derugRequestRepository.saveDerugRequest(foundDerugForm);

      return {
        collectionKey: updatedDerugRequest.collectionKey,
        signMessage,
        userPubkey,
      };
    }
  }
}
