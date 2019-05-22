import gql from 'graphql-tag';

export default gql`
  query EngineQuery {
    amguPrices(orderBy: timestamp) {
      price
      timestamp
    }

    amguPayments(orderBy: timestamp) {
      amount
      timestamp
    }
  }
`;
