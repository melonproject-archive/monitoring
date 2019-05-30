import gql from 'graphql-tag';

export const ContractsQuery = gql`
  query ContractsQuery($limit: Int!) {
    contracts(first: $limit, where: { name_in: ["Registry", "Engine", "Version", "Hub/Fund", "Asset"] }) {
      id
      name
      creationTime
      parent {
        id
      }
    }
  }
`;

export const ContractsScrapingQuery = gql`
  query ContractsScrapingQuery($limit: Int!, $skip: Int!) {
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
