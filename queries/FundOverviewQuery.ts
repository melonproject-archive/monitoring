import gql from 'graphql-tag';

export const FundOverviewQuery = gql`
  query FundOverviewQuery {
    fundCounts(orderBy: timestamp) {
      active
      nonActive
      timestamp
    }

    networkValues(orderBy: timestamp) {
      timestamp
      gav
    }
  }
`;

export const FundListQuery = gql`
  query FundListQuery($limit: Int!, $skip: Int!) {
    funds(orderBy: name, first: $limit, skip: $skip) {
      id
      name
      gav
      sharePrice
      totalSupply
      isShutdown
      creationTime
      investments {
        id
      }
    }
  }
`;
