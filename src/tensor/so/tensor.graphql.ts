import { graphQLClient } from 'src/utilities/solana/utilities';
import { ICollectionRecentActivities } from '../dto/tensor.dto';
import {
  mapCollectionListings,
  mapCollectionStats,
  mapNextData,
  mapRecentActivities,
  mapTraitsQuery,
} from './mappers';
import {
  ACTIVE_LISTINGS_QUERY,
  FP_QUERY,
  RECENT_ACTIVITIES_QUERY,
  TRAITS_QUERY,
} from './query';

export const getFloorPrice = async (slug: string) => {
  const data = (await graphQLClient.request(FP_QUERY, { slug })) as any;

  return mapCollectionStats(data);
};

export const getTraits = async (slug: string) => {
  const data = (await graphQLClient.request(TRAITS_QUERY, { slug })) as any;

  return mapTraitsQuery(data);
};

export const getListings = async (slug: string) => {
  const data = (await graphQLClient.request(ACTIVE_LISTINGS_QUERY, {
    slug,
    filters: null,
    sortBy: 'PriceAsc',
    limit: 100,
  })) as any;

  return mapCollectionListings(data);
};

export const recentActivities = async (slug: string) => {
  const data = (await graphQLClient.request(RECENT_ACTIVITIES_QUERY, {
    slug,
    filters: null,
    filter: {
      txType: 'LIST',
    },
    limit: 100,
  })) as any;

  const recentActivities = mapRecentActivities(data);
  const remainingActivities = await fetchWhileHasActivities(
    recentActivities,
    data.recentTransactions.page.endCursor.txKey,
    slug,
    data.recentTransactions.page.endCursor.txAt,
  );
  return [...recentActivities, ...remainingActivities];
};

export const fetchWhileHasActivities = async (
  firstBatch: ICollectionRecentActivities[],
  nextCursor: string,
  slug: string,
  txAt: number,
) => {
  let response: any;
  do {
    response = await graphQLClient.request(RECENT_ACTIVITIES_QUERY, {
      filter: {
        txType: 'LIST',
      },
      limit: 100,
      slug,
      cursor: {
        txKey: nextCursor,
        txAt,
      },
    });

    nextCursor = response.recentTransactions.page.endCursor.txKey;
    txAt = response.recentTransactions.page.endCursor.txAt;
    firstBatch = [...firstBatch, ...mapRecentActivities(response.data)];
  } while (response && response.recentTransactions.page.hasMore);

  return firstBatch.reverse();
};
