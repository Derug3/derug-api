import { Injectable } from '@nestjs/common';
import { DerugDto } from './dto/derug.dto';
import { DerugRepository } from './repository/derug-form.repository';
import { GetDerugRequests } from './so/get-derug-requests';
import { SaveDerugRequest } from './so/save-derug-request';

@Injectable()
export class DerugFormService {
  private saveDerugRequest: SaveDerugRequest;
  private getDerugRequests: GetDerugRequests;

  constructor(private readonly derugRepo: DerugRepository) {
    this.saveDerugRequest = new SaveDerugRequest(derugRepo);
    this.getDerugRequests = new GetDerugRequests(derugRepo);
  }

  saveNewDerugRequest(derugDto: DerugDto) {
    return this.saveDerugRequest.execute(derugDto);
  }

  getAllDerugRequests(collection: string) {
    return this.getDerugRequests.execute(collection);
  }
}
