import gql from 'graphql-tag';

export default gql`
  query InvestorDetailsQuery($investor: ID!) {
    investor(id: $investor) {
      id
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
      }
    }
  }
`;
