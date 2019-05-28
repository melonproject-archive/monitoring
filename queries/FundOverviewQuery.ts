import gql from 'graphql-tag';

export const FundOverviewQuery = gql`
  query FundOverviewQuery($limit: Int!) {
    funds(orderBy: name, first: $limit) {
      id
      name
      gav
      sharePrice
      isShutdown
      creationTime
    }

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

export const FundOverviewScrapingQuery = gql`
  query FundOverviewScrapingQuery($limit: Int!, $skip: Int!) {
    funds(orderBy: name, first: $limit, skip: $skip) {
      id
      name
      gav
      sharePrice
      isShutdown
      creationTime
    }
  }
`;
