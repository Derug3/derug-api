import { PublicKey } from '@solana/web3.js';
import {
  graphQLClient,
  heliusMetadataEndpoint,
} from 'src/utilities/solana/utilities';
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
  makeTensorQuery,
  RECENT_ACTIVITIES_QUERY,
  TRAITS_QUERY,
} from './query';

export const getFloorPrice = async (slug: string) => {
  const data = (await graphQLClient.request(FP_QUERY, { slug })) as any;

  const mapped = mapCollectionStats(data);

  return mapped;
};

export const getTraits = async (slug: string) => {
  const fpQueryBody = JSON.stringify({
    query: FP_QUERY,
    variables: {
      slug: slug,
    },
  });

  const fpData = await makeTensorQuery(fpQueryBody);

  if (!fpData.data?.instrumentTV2) {
    return null;
  }

  const requestBody = JSON.stringify({
    query: TRAITS_QUERY,
    variables: {
      slug: fpData.data.instrumentTV2.slug,
    },
  });

  const data = await makeTensorQuery(requestBody);
  console.log(data);

  return {
    traits: mapTraitsQuery(data.data),
    tensorSlug: fpData.data.instrumentTV2.slug,
  };
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

  if (nullImageListings.length > 0) {
    try {
      const mintList = nullImageListings.slice(0, 100).map((n) => n.mint);
      const heliusNfts = await (
        await fetch(heliusMetadataEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            mintAccounts: mintList,
            includeOffChain: true,
          }),
        })
      ).json();

      heliusNfts.forEach((nft) => {
        const relatedListing = listings.findIndex(
          (l) => l.mint === nft.account,
        );
        listings[relatedListing] = {
          ...listings[relatedListing],
          imageUrl: nft.offChainMetadata?.metadata?.image,
        };
      });
    } catch (error) {
      console.log(error);
    }
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
