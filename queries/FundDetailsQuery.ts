import gql from 'graphql-tag';

export const FundDetailsQuery = gql`
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
        feesInDenominationAsset
        sharePrice
        timestamp
      }
      investmentHistory(orderBy: timestamp) {
        action
        timestamp
        shares
        sharePrice
        amount
        amountInDenominationAsset
        owner {
          id
        }
        asset {
          id
          symbol
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
      currentHoldings: holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 12) {
        timestamp
        holding
        assetGav
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
      feeManager {
        feeRewardHistory {
          timestamp
          shares
        }
      }
    }

    assets {
      symbol
      id
    }
  }
`;
