import gql from 'graphql-tag';

export default gql`
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
          symbol
        }
      }
      investmentHistory(orderBy: timestamp) {
        id
        action
        shares
        sharePrice
        amount
        timestamp
        fund {
          id
          name
        }
      }
      valuationHistory(orderBy: timestamp) {
        timestamp
        gav
        nav
      }
    }
  }
`;
