import gql from 'graphql-tag';

export const FundCountQuery = gql`
  query FundCountQuery($limit: Int!, $skip: Int!) {
    fundCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      active
      nonActive
      timestamp
    }
  }
`;

export const MelonNetworkHistoryQuery = gql`
  query MelonNetworkHistoryQuery($limit: Int!, $skip: Int!) {
    melonNetworkHistories(orderBy: timestamp, first: $limit, skip: $skip) {
      timestamp
      gav
      validGav
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
      calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
        sharePrice
        timestamp
      }
    }
  }
`;
