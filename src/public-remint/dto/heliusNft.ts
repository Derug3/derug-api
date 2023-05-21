export interface HeliusNft {
  mint: string;
  onChainData: {
    key: string;
    mint: string;
    updateAuthority: string;
    data: {
      name: string;
      symbol: string;
      uri: string;
      sellerFeeBasisPoints: 0;
      creators: [
        {
          address: string;
          share: string;
          verified: true;
        },
      ];
    };
    tokenStandard: string;
    primarySaleHappened: true;
    isMutable: true;
    editionNonce: 0;
    collection: {
      key: string;
      verified: true;
    };
    collectionDetails: {
      size: number;
    };
  };
  offChainData: {
    name: string;
    symbol: string;
    attributes: [
      {
        traitType: string;
        value: string;
      },
    ];
    sellerFeeBasisPoints: number;
    image: string;
    properties: {
      category: string;
      files: [
        {
          uri: string;
          type: string;
        },
      ];
      creators: [
        {
          address: string;
          share: string;
        },
      ];
    };
  };
}
