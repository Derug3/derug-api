import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import dayjs from 'dayjs';
import { divide, multiply, round } from 'mathjs';
import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { v4 } from 'uuid';
import {
  ITrait,
  ITraitInfo,
  ICollectionStats,
  INftListing,
  ListingSource,
  ICollectionRecentActivities,
} from '../dto/tensor.dto';
import { CollectionListing } from '../entities/listing.entity';
import { CollectionStats } from '../entities/stats.entity';
import { NftTrait } from '../entities/traits.entity';

export const mapTraitsQuery = (
  data: any,
  collection: Collection,
): NftTrait[] => {
  const numTraits = data?.traits?.numMints ?? 0;

  const trait: NftTrait[] = [];

  if (!data || !data.traits) {
    return [];
  }

  Object.keys(data.traits.traitMeta).forEach((traitMeta) => {
    trait.push({
      name: traitMeta,
      collection,
      nftTraitId: v4(),
      traits: Object.keys(data.traits.traitMeta[traitMeta]).map(
        (singleTrait: any) => {
          return {
            name: singleTrait,
            percentage: round(
              multiply(
                (data.traits.traitMeta[traitMeta][singleTrait]['n'] as any) /
                  numTraits,
                100,
              ),
              2,
            ),
            traitId: v4(),
            fp: data.traits.traitActive[traitMeta]?.singleTrait
              ? data.traits.traitActive[traitMeta][singleTrait].p
              : 0,
            image: data.traits.traitMeta[traitMeta][singleTrait]['img'],
            listedCount: data.traits.traitActive[traitMeta]?.singleTrait
              ? data.traits.traitActive[traitMeta][singleTrait].n
              : 0,
          };
        },
      ),
    });
  });

  return trait;
};

export const mapCollectionStats = (
  data: any,
  collection: Collection,
): CollectionStats | undefined => {
  const dataInfo = data.instrumentTV2;
  if (dataInfo)
    return {
      firstListed: dataInfo.firstListDate,
      marketCap: dataInfo.statsOverall.marketCap,
      numListed: dataInfo.statsOverall.numListed,
      numMints: dataInfo.statsOverall.numMints,
      symbol: collection.symbol,
      fp: +dataInfo.statsOverall.floorPrice,
      volume24H: dataInfo.statsOverall.floor24h,
      royalty: dataInfo.sellRoyaltyFeeBPS / 100,
      id: v4(),
    };
};
export const mapCollectionListings = (
  data: any,
  collection: Collection,
): CollectionListing[] => {
  if (!data.activeListingsV2) {
    return [];
  }
  const nftListings: CollectionListing[] = [];

  if (!data?.activeListingsV2) {
    return [];
  }

  data.activeListingsV2.txs.forEach((p: any) => {
    nftListings.push({
      mint: p.mint.onchainId,
      owner: p.tx.sellerId,
      price: divide(+p.tx.grossAmount, LAMPORTS_PER_SOL),
      soruce: p.tx.source as ListingSource,
      imageUrl: p.mint.imageUri,
      txAt: p.tx.txAt,
      name: p.mint.name,
      id: v4(),
      collection,
    });
  });

  return nftListings;
};

export const mapNextData = (data: any) => {
  if (data.activeListings.page.endCursor)
    return {
      endCursor: data.activeListings.page.endCursor.txKey,
      hasMore: data.activeListings.page.hasMore,
    };
  else {
    return {
      hasMore: false,
      endCursor: undefined,
    };
  }
};

export const mapRecentActivities = (data: any) => {
  const recentTransacions: ICollectionRecentActivities[] = [];
  data.recentTransactions.txs.forEach((rt: any) => {
    recentTransacions.push({
      dateExecuted: rt.tx.txAt,
      txId: rt.tx.txId,
      image: rt.mint.imageUri,
      mint: rt.mint.onchainId,
      price: +rt.tx.grossAmount / LAMPORTS_PER_SOL,
      rarityRank: rt.mint.rarityRankStat,
      source: rt.tx.source as ListingSource,
    });
  });

  return recentTransacions;
};
