import gql from 'graphql-tag';

export default gql`
  query InvestorDetailsQuery($investor: ID!) {
    investor(id: $investor) {
      id
      investments {
        shares
        fund {
          id
          name
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
