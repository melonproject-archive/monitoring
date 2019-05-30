import gql from 'graphql-tag';

export const ContractsQuery = gql`
  query ContractsQuery($limit: Int!, $skip: Int!) {
    contracts(first: $limit, skip: $skip, where: { name_in: ["Registry", "Engine", "Version", "Hub/Fund", "Asset"] }) {
      id
      name
      creationTime
      parent {
        id
      }
    }
  }
`;
