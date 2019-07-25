import gql from 'graphql-tag';

export const ContractDetailsQuery = gql`
  query ContractDetailsQuery($address: ID!) {
    contract(id: $address) {
      id
      name
      description
      createdAt
      parent {
        id
        name
      }
      children {
        id
        name
        description
        createdAt
      }
    }
  }
`;
