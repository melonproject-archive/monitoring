import gql from 'graphql-tag';

export const AssetsQuery = gql`
  query AssetsQuery {
    assets(orderBy: symbol) {
      id
      symbol
      decimals
      priceHistory(orderBy: timestamp) {
        id
        price
        timestamp
      }
    }
  }
`;

export const AssetListQuery = gql`
  query AssetListQuery {
    assets(orderBy: symbol) {
      id
      symbol
      name
      decimals
      lastPrice
      lastPriceUpdate
      lastPriceValid
      fundAccountings {
        id
        fund {
          id
        }
      }
      melonNetworkAssetHistory(orderBy: timestamp, orderDirection: desc, first: 1) {
        id
        timestamp
        assetGav
        amount
      }
    }
  }
`;
