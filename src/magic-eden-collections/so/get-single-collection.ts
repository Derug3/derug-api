import { BadRequestException, Logger } from '@nestjs/common';
import { TensorService } from 'src/tensor/tensor.service';
import { CollectionRepository } from '../repository/collection.reposity';

export class GetSingleCollection {
  constructor(
    private readonly collectionRepo: CollectionRepository,
    private readonly tensorService: TensorService,
  ) {}
  logger = new Logger(GetSingleCollection.name);
  async execute(slug: string) {
    try {
      const collection = await this.collectionRepo.getBySlug(slug);
      if (!collection.traits || collection.traits.length === 0) {
        this.logger.log('Found collection with no traits');
        await this.tensorService.storeStats(collection.symbol, collection);
        const updatedCollection = await this.collectionRepo.getBySlug(slug);
        this.logger.log(
          `Returning updated collection with ${updatedCollection.traits.length} traits`,
        );

        return updatedCollection;
      }
      return collection;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
