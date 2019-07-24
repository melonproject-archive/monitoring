import gql from 'graphql-tag';

export const ContractDetailsQuery = gql`
  query ContractDetailsQuery($address: ID!) {
    contract(id: $address) {
      id
      name
      createdAt
      parent {
        id
        name
      }
      children {
        id
      }
    }
  }
`;
