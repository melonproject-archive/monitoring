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

    contracts(where: { name_in: ["Registry", "Engine", "Version", "Hub/Fund"] }) {
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
