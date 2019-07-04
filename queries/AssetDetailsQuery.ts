import gql from 'graphql-tag';

export const AssetDetailsQuery = gql`
  query AssetDetailsQuery($asset: ID!) {
    asset(id: $asset) {
      id
      symbol
      name
      decimals
      melonNetworkAssetHistory(orderBy: timestamp, orderDirection: asc) {
        timestamp
        assetGav
        amount
      }
      fundAccountings {
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
  }
`;

export const SingleAssetPriceHistoryQuery = gql`
  query SingleAssetPriceHistoryQuery($asset: String!, $limit: Int!, $skip: Int!) {
    assetPriceHistories(first: $limit, skip: $skip, orderBy: timestamp, where: { asset: $asset }) {
      price
      timestamp
    }
  }
`;

export const MelonNetworkAssetHistoryQuery = gql`
  query MelonNetworkAssetHistoryQuery($asset: String!, $limit: Int!, $skip: Int!) {
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
