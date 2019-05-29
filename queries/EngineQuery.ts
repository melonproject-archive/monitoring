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
