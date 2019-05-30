import gql from 'graphql-tag';

export default gql`
  query AssetDetailsQuery($asset: ID!) {
    asset(id: $asset) {
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
