import { BadRequestException } from '@nestjs/common';
import {
  MAGIC_EDEN_API,
  COLLECTIONS,
  OFFSET,
  LIMIT,
  LISTINGS,
} from 'src/utilities/constants';
import { CollectionRepository } from '../repository/collection.reposity';

export class GetListedNfts {
  async execute(symbol: string) {
    try {
      const result = await fetch(
        `${MAGIC_EDEN_API}${COLLECTIONS}/${symbol}/${LISTINGS}?${OFFSET}=0&${LIMIT}=20`,
      );
      return result.json();
    } catch (error) {
      return new BadRequestException();
    }
  }
}
