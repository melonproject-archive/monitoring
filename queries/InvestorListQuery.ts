import gql from 'graphql-tag';

export const InvestorCountQuery = gql`
  query InvestorCountQuery($limit: Int!, $skip: Int!) {
    investorCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      numberOfInvestors
      timestamp
    }
    # state(id: "0x") {
    #   id
    # }
  }
`;

export const InvestorListQuery = gql`
  query InvestorListQuery($limit: Int!, $skip: Int!) {
    investors(orderBy: id, first: $limit, skip: $skip) {
      id
      createdAt
      investments {
        id
        gav
        nav
      }
    }
  }
`;
