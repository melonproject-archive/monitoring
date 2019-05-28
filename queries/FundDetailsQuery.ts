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
      nav
      totalSupply
      sharePrice
      calculationsHistory(orderBy: timestamp) {
        gav
        nav
        totalSupply
        sharePrice
        timestamp
      }
      investmentHistory(orderBy: timestamp) {
        action
        timestamp
        shares
        sharePrice
        owner {
          id
        }
      }
      holdingsHistory(orderBy: timestamp) {
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
