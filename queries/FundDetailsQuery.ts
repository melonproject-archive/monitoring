import gql from 'graphql-tag';

export const FundDetailsQuery = gql`
  query FundDetailsQuery($fund: ID!) {
    fund(id: $fund) {
      id
      name
      createdAt
      isShutdown
      shutdownAt
      manager {
        id
      }
      version {
        name
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
        amount
        assetGav
        asset {
          id
          symbol
        }
      }
      currentHoldings: holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 12) {
        timestamp
        amount
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
        id
        managementFee {
          managementFeeRate
        }
        performanceFee {
          performanceFeeRate
          performanceFeePeriod
        }
        feeRewardHistory {
          timestamp
          shares
        }
      }
      policyManager {
        id
        policies {
          identifier
          position
          identifier
          assetWhiteList {
            symbol
          }
          assetBlackList {
            symbol
          }
          maxConcentration
          maxPositions
          priceTolerance
        }
      }
      accounting {
        id
        denominationAsset {
          symbol
        }
      }
      participation {
        id
      }
      share {
        id
      }
      trading {
        id
      }
      vault {
        id
      }
    }

    assets {
      symbol
      id
    }
  }
`;
