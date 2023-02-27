import {
  DerugRequestDto,
  UserDerugRequestDto,
} from '../dto/derug-requests.dto';
import { DerugRepository } from '../repository/derug-form.repository';

export class GetDerugRequests {
  constructor(private readonly derugRequestRepository: DerugRepository) {}

  async execute(collection: string): Promise<DerugRequestDto> {
    const derugRequests =
      await this.derugRequestRepository.getRequestsByCollection(collection);

    return {
      collection: derugRequests.collectionKey,
      dateCreated: derugRequests.dateCreated,
      userRequests: derugRequests.userRequests.map((dr) => {
        return {
          dateStored: dr.lastRequest,
          nftsNumber: dr.collectionNftsCount,
          userPubkey: dr.userPubkey,
        };
      }),
      lastRequest: derugRequests.userRequests.sort((a, b) =>
        a.lastRequest > b.lastRequest ? 1 : -1,
      )[0].lastRequest,
    };
  }
}
