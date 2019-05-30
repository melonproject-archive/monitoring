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

export const SingleAssetPriceUpdateQuery = gql`
  query SingleAssetPriceUpdateQuery($id: String!, $limit: Int!) {
    priceHistory(first: $limit, orderBy: timestamp, where: { asset: $id }) {
      price
      timestamp
    }
  }
`;

export const SingleAssetPriceUpdateScrapingQuery = gql`
  query SingleAssetPriceUpdateQuery($id: String!, $limit: Int!, $skip: Int!) {
    priceHistory(first: $limit, skip: $skip, orderBy: timestamp, where: { asset: $id }) {
      price
      timestamp
    }
  }
`;
