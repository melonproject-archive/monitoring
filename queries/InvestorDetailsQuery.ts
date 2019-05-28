import gql from 'graphql-tag';

export default gql`
  query InvestorDetailsQuery($investor: ID!) {
    investor(id: $investor) {
      id
      investments {
        id
        shares
        gav
        fund {
          id
          name
        }
        valuationHistory(orderBy: timestamp) {
          id
          gav
          timestamp
        }
      }
      investmentHistory(orderBy: timestamp) {
        id
        action
        shares
        sharePrice
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
