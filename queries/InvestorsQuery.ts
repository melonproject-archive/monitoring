import gql from 'graphql-tag';

export const InvestorCountQuery = gql`
  query InvestorCountQuery {
    investorCounts(orderBy: timestamp) {
      numberOfInvestors
      timestamp
    }
  }
`;

export const InvestorListQuery = gql`
  query InvestorListQuery($limit: Int!, $skip: Int!) {
    investors(orderBy: id, first: $limit, skip: $skip) {
      id
      investments {
        id
        gav
      }
    }
  }
`;
