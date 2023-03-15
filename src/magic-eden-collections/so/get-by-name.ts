import { BadRequestException } from '@nestjs/common';
import { CollectionRepository } from '../repository/collection.reposity';

export class GetByName {
  constructor(private readonly collectionsRepo: CollectionRepository) {}

  execute(name: string) {
    try {
      return this.collectionsRepo.getByName(name);
    } catch (error) {
      return new BadRequestException();
    }
  }
}
