import gql from 'graphql-tag';

export const FundOverviewQuery = gql`
  query FundOverviewQuery($limit: Int!, $skip: Int!) {
    fundCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      active
      nonActive
      timestamp
    }

    melonNetworkHistories(orderBy: timestamp) {
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
      createdAt
      investments {
        id
      }
      version {
        name
      }
      accounting {
        denominationAsset {
          symbol
        }
      }
    }
  }
`;
