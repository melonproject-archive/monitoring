import gql from 'graphql-tag';

export const EngineQuery = gql`
  query EngineQuery($limit: Int!) {
    amguPrices(orderBy: timestamp) {
      price
      timestamp
    }

    amguPayments(orderBy: timestamp, first: $limit) {
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

export const AmguPaymentsQuery = gql`
  query AmguPaymentsQuery($limit: Int!, $skip: Int!) {
    amguPayments(orderBy: timestamp, first: $limit, skip: $skip) {
      amount
      timestamp
    }
  }
`;

export const ContractsQuery = gql`
  query ContractsQuery {
    contracts(where: { name_in: ["Registry", "Engine", "Version", "Hub/Fund", "Asset"] }) {
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

export const ContractsScrapingQuery = gql`
  query ContractsScrapingQuery($limit: Int!, $skip: Int!) {
    contracts(first: $limit, skip: $skip, where: { name_in: ["Registry", "Engine", "Version", "Hub/Fund", "Asset"] }) {
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
