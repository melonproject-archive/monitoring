import gql from 'graphql-tag';

export default gql`
  query FundDetailsQuery($fund: ID!) {
    fund(id: $fund) {
      id
      name
      manager {
        id
      }
      gav
      totalSupply
      grossSharePrice
      calculationsUpdates(orderBy: timestamp) {
        gav
        totalSupply
        grossSharePrice
        timestamp
      }
      investmentLog(orderBy: timestamp) {
        action
        timestamp
        shares
        sharePrice
        owner {
          id
        }
      }
      holdingsLog(orderBy: timestamp) {
        timestamp
        holding
        asset {
          id
          symbol
        }
      }
      investments {
        shares
        owner {
          id
        }
      }
    }

    assets {
      symbol
      id
    }
  }
`;
