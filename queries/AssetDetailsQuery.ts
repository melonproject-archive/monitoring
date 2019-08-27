import gql from 'graphql-tag';

export const AssetDetailsQuery = gql`
  query AssetDetailsQuery($asset: ID!) {
    asset(id: $asset) {
      id
      symbol
      name
      decimals
    }
  }
`;

export const SingleAssetPriceHistoryQuery = gql`
  query SingleAssetPriceHistoryQuery($asset: ID!, $limit: Int!, $skip: Int!) {
    assetPriceHistories(first: $limit, skip: $skip, orderBy: timestamp, where: { asset: $asset }) {
      price
      timestamp
    }
  }
`;

export const MelonNetworkAssetHistoryQuery = gql`
  query MelonNetworkAssetHistoryQuery($asset: ID!, $limit: Int!, $skip: Int!) {
    melonNetworkAssetHistories(first: $limit, skip: $skip, orderBy: timestamp, where: { asset: $asset }) {
      timestamp
      assetGav
      amount
      asset {
        decimals
      }
    }
  }
`;

export const AssetFundsQuery = gql`
  query AssetFundsQuery($limit: Int!, $skip: Int!) {
    accountings(first: $limit, skip: $skip) {
      fund {
        id
        name
        holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 11) {
          amount
          assetGav
          timestamp
          asset {
            id
            symbol
            decimals
          }
        }
      }
    }
  }
`;
