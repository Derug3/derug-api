import { PublicKey } from '@solana/web3.js';
import { graphQLClient, metaplex } from 'src/utilities/solana/utilities';
import { ICollectionRecentActivities, INftListing } from '../dto/tensor.dto';
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

  const mapped = mapCollectionStats(data);

  return mapped;
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

  const listings = mapCollectionListings(data);
  const nullImageListings = listings.filter((l) => l.imageUrl === null);
  for (const nullListing of nullImageListings) {
    try {
      const metadata = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: new PublicKey(nullListing.mint) });
      const metadataAcc = await metaplex
        .nfts()
        .findByMetadata({ metadata, loadJsonMetadata: true });
      const editedData: INftListing = {
        ...nullListing,
        imageUrl: metadataAcc.json.image,
      };
      const listingIndex = listings.findIndex(
        (l) => l.mint === nullListing.mint,
      );
      listings[listingIndex] = { ...editedData };
    } catch (error) {}
  }
  return listings;
};

export const recentActivities = async (slug: string) => {
  const data = (await graphQLClient.request(RECENT_ACTIVITIES_QUERY, {
    slug,
    filter: {
      txType: 'LIST',
      price: 'positive',
    },
    limit: 100,
  })) as any;

  if (data.recentTransactions.txs.length === 0) {
    return [];
  }
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

    if (response) {
      nextCursor = response.recentTransactions.page.endCursor.txKey;
      txAt = response.recentTransactions.page.endCursor.txAt;
      firstBatch = [...firstBatch, ...mapRecentActivities(response)];
    }
  } while (response && response.recentTransactions.page.hasMore);

  return firstBatch.reverse();
};
