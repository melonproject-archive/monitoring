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
        valuations(orderBy: timestamp) {
          id
          gav
          timestamp
        }
      }
      investmentLog(orderBy: timestamp) {
        id
        action
        shares
        timestamp
        fund {
          id
          name
        }
      }
    }
  }
`;
