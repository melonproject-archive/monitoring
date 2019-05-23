import gql from 'graphql-tag';

export default gql`
  query FundDetailsQuery($fund: ID!) {
    fund(id: $fund) {
      id
      name
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
    }

    assets {
      symbol
      id
    }
  }
`;
