import gql from 'graphql-tag';

export default gql`
  query AssetsQuery {
    assets(orderBy: symbol) {
      id
      symbol
      decimals
      priceUpdates(orderBy: timestamp) {
        price
        timestamp
      }
    }
  }
`;
