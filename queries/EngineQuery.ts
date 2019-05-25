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

    contracts(orderBy: creationTime) {
      id
      name
      creationTime
      parent {
        id
      }
      children {
        id
      }
    }
  }
`;
