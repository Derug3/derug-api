import { Injectable } from '@nestjs/common';
import {
  getFloorPrice,
  getListings,
  getTraits,
  recentActivities,
} from './so/tensor.graphql';

@Injectable()
export class TensorService {
  getFloorPriceTensor(slug: string) {
    return getFloorPrice(slug);
  }

  getTraitsTensor(slug: string) {
    return getTraits(slug);
  }

  getTensorListings(slug: string) {
    return getListings(slug);
  }

  getTensorRecentActivities(slug: string) {
    return recentActivities(slug);
  }
}
