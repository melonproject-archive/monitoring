import gql from 'graphql-tag';

export const InvestmentCountQuery = gql`
  query InvestmentCountQuery($limit: Int!, $skip: Int!) {
    investmentCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      all
      active
      nonActive
      timestamp
    }
  }
`;

export const InvestorCountQuery = gql`
  query InvestorCountQuery($limit: Int!, $skip: Int!) {
    investorCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      active
      nonActive
      timestamp
    }
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
      investmentHistory(where: { action_not: "Fee allocation" }) {
        id
        action
        timestamp
        amountInDenominationAsset
      }
      valuationHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        gav
        nav
      }
    }
  }
`;

export const InvestmentHistoryQuery = gql`
  query InvestmentHistoryQuery($limit: Int!, $skip: Int!) {
    investmentHistories(
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $skip
      where: { action_not: "Fee allocation" }
    ) {
      id
      timestamp
      fund {
        id
        name
      }
      owner {
        id
      }
      action
      amountInDenominationAsset
      amount
      asset {
        id
        symbol
        decimals
      }
    }
  }
`;

export const InvestmentRequestsQuery = gql`
  query InvestmentRequestsQuery($limit: Int!) {
    investmentRequests(where: { status: "PENDING" }, orderBy: requestTimestamp, orderDirection: desc, first: $limit) {
      id
      requestTimestamp
      fund {
        id
        name
      }
      owner {
        id
      }
      status
      amount
      shares
      asset {
        id
        symbol
        decimals
      }
    }
  }
`;
