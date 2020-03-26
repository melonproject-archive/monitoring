import gql from 'graphql-tag';

export const InvestementCountQuery = gql`
  query InvestorCountQuery($limit: Int!, $skip: Int!) {
    investmentCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      active
      nonActive
      timestamp
    }
  }
`;

export const InvestmentListQuery = gql`
  query InvestmentListQuery($limit: Int!, $skip: Int!) {
    investments(orderBy: createdAt, orderDirection: desc, first: $limit, skip: $skip) {
      id
      createdAt
      shares
      owner {
        id
      }
      fund {
        id
        name
      }
      nav
    }
  }
`;
