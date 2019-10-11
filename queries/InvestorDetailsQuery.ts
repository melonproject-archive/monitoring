import gql from 'graphql-tag';

export const InvestorDetailsQuery = gql`
  query InvestorDetailsQuery($investor: ID!) {
    investor(id: $investor) {
      id
      createdAt
      investments {
        id
        shares
        gav
        nav
        fund {
          id
          name
        }
        valuationHistory(orderBy: timestamp) {
          id
          gav
          nav
          timestamp
        }
        history {
          id
          action
          amountInDenominationAsset
          timestamp
        }
      }
      investmentRequests(orderBy: requestTimestamp) {
        id
        fund {
          id
          name
        }
        requestTimestamp
        status
        shares
        amount
        updateTimestamp
        asset {
          id
          symbol
          decimals
        }
      }
      investmentHistory(orderBy: timestamp) {
        id
        action
        shares
        sharePrice
        amount
        amountInDenominationAsset
        timestamp
        fund {
          id
          name
        }
      }
      valuationHistory(orderBy: timestamp) {
        id
        timestamp
        gav
        nav
      }
    }
  }
`;

export const InvestmentValuationHistoryQuery = gql`
  query InvestmentValuationHistoryQuery($ids: [ID!], $limit: Int!, $skip: Int!) {
    investmentValuationHistories(where: { investment_in: $ids }, orderBy: timestamp, first: $limit, skip: $skip) {
      id
      gav
      nav
      timestamp
      investment {
        id
      }
    }
  }
`;

export const InvestorValuationHistoryQuery = gql`
  query InvestorValuationHistoryQuery($id: ID!, $limit: Int!, $skip: Int!) {
    investorValuationHistories(where: { owner: $id }, orderBy: timestamp, first: $limit, skip: $skip) {
      id
      gav
      nav
      timestamp
    }
  }
`;
