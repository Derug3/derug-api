import { Controller, Get, Param, Query } from '@nestjs/common';
import { CollectionVolumeService } from './collection-volume.service';
import { CollectionVolumeFilter } from './entity/collection-volume.entity';

@Controller('collection-volume')
export class CollectionVolumeController {
  constructor(
    private readonly collectionVolumeService: CollectionVolumeService,
  ) {}

  @Get('top-volume')
  getTopVolumeCollections() {
    return this.collectionVolumeService.getTopCollectionsByVolume();
  }

  @Get('/pagination/:pageNumber')
  getCollections(@Param('pageNumber') pageNumber: number) {
    return this.collectionVolumeService.getCollectionsWithVolumePagination(
      pageNumber,
    );
  }

  @Get('/filter')
  getWithFilter(@Query('orderBy') filter: CollectionVolumeFilter) {
    return this.collectionVolumeService.getWithFilter(filter);
  }
}
