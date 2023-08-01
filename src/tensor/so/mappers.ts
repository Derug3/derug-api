import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import dayjs from 'dayjs';
import { divide, multiply, round } from 'mathjs';
import {
  ITrait,
  ITraitInfo,
  ICollectionStats,
  INftListing,
  ListingSource,
  ICollectionRecentActivities,
} from '../dto/tensor.dto';

export const mapTraitsQuery = (data: any): ITrait[] => {
  const numTraits = data?.traits?.numMints ?? 0;

  const trait: ITrait[] = [];

  Object.keys(data.traits.traitMeta).forEach((traitMeta) => {
    trait.push({
      name: traitMeta,
      values: Object.keys(data.traits.traitMeta[traitMeta]).map(
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

export const mapCollectionStats = (data: any): ICollectionStats | undefined => {
  const dataInfo = data.instrumentTV2;
  if (dataInfo)
    return {
      firstListed: dataInfo.firstListDate,
      marketCap: +dataInfo.statsOverall.marketCap,
      numListed: dataInfo.statsOverall.numListed,
      numMints: dataInfo.statsOverall.numMints,
      fp: +dataInfo.statsOverall.floorPrice,
      volume24H: dataInfo.statsOverall.floor24h,
      royalty: dataInfo.sellRoyaltyFeeBPS / 100,
      slug: dataInfo.id,
    };
};

export const mapCollectionListings = (data: any): INftListing[] => {
  const nftListings: INftListing[] = [];

  data.activeListings.txs.forEach((p: any) => {
    nftListings.push({
      mint: p.mint.onchainId,
      owner: p.tx.sellerId,
      price: divide(+p.tx.grossAmount, LAMPORTS_PER_SOL),
      soruce: p.tx.source as ListingSource,
      imageUrl: p.mint.imageUri,
      txAt: p.tx.txAt,
      name: p.mint.name,
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
