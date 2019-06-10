import gql from 'graphql-tag';

export const ContractsQuery = gql`
  query ContractsQuery($limit: Int!, $skip: Int!) {
    contracts(first: $limit, skip: $skip, where: { name_in: ["Registry", "Engine", "Version", "Fund", "Asset"] }) {
      id
      name
      createdAt
      parent {
        id
      }
    }
  }
`;
