import gql from 'graphql-tag';

export const AssetsQuery = gql`
  query AssetsQuery {
    assets(orderBy: symbol) {
      id
      symbol
      decimals
      priceHistory(orderBy: timestamp) {
        price
        timestamp
      }
    }
  }
`;

export const SingleAssetPriceHistoryQuery = gql`
  query SingleAssetPriceHistoryQuery($id: String!, $limit: Int!, $skip: Int!) {
    assetPriceHistories(first: $limit, skip: $skip, orderBy: timestamp, where: { asset: $id }) {
      price
      timestamp
    }
  }
`;
