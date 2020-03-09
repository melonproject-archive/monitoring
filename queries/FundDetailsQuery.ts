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
        id
        name
      }
      registry {
        id
      }
      priceSource {
        id
      }
      gav
      nav
      totalSupply
      sharePrice

      investmentHistory(orderBy: timestamp, where: { action_not: "Fee allocation" }) {
        id
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
          decimals
        }
      }
      holdingsHistory(orderBy: timestamp) {
        id
        timestamp
        amount
        assetGav
        asset {
          id
          symbol
        }
      }
      currentHoldings: holdingsHistory(orderBy: timestamp, orderDirection: desc, first: 12) {
        id
        timestamp
        amount
        assetGav
        asset {
          id
          symbol
          decimals
        }
      }
      investments {
        id
        shares
        owner {
          id
        }
      }
      feeManager {
        id
        managementFee {
          id
          managementFeeRate
        }
        performanceFee {
          id
          performanceFeeRate
          performanceFeePeriod
          initializeTime
        }
        feeRewardHistory {
          id
          timestamp
          shares
        }
      }
      policyManager {
        id
        policies {
          id
          identifier
          position
          identifier
          assetWhiteList {
            id
            symbol
          }
          assetBlackList {
            id
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
          id
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
        exchanges {
          id
          name
        }
        calls(orderBy: timestamp, orderDirection: "desc") {
          id
          timestamp
          exchange {
            id
            name
          }
          orderAddress2 {
            id
            symbol
            decimals
          }
          orderAddress3 {
            id
            symbol
            decimals
          }
          orderValue0
          orderValue1
          orderValue6
          methodSignature
          methodName
        }
        trades {
          id
          timestamp
          methodName
          exchange {
            id
            name
          }
          assetBought {
            id
            symbol
            decimals
          }
          amountBought
          assetSold {
            id
            symbol
            decimals
          }
          amountSold
        }
      }
      vault {
        id
      }
    }

    investmentRequests(where: { fund: $fund, status: "PENDING" }, orderBy: requestTimestamp) {
      fund {
        id
        name
      }
      owner {
        id
      }
      requestTimestamp
      status
      shares
      amount
      updateTimestamp
      asset {
        id
        symbol
        decimals
      }
    }

    assets {
      id
      symbol
    }
  }
`;

export const FundCalculationsHistoryQuery = gql`
  query FundCalculationsHistoryQuery($fund: ID!, $limit: Int!, $skip: Int!) {
    fundCalculationsHistories(where: { fund: $fund }, orderBy: timestamp, first: $limit, skip: $skip) {
      id
      gav
      nav
      totalSupply
      feesInDenominationAsset
      sharePrice
      timestamp
    }
  }
`;

export const FundHoldingsHistoryQuery = gql`
  query FundHoldingsHistoryQuery($id: ID!, $limit: Int!, $skip: Int!) {
    fundHoldingsHistories(where: { fund: $id }, orderBy: timestamp, first: $limit, skip: $skip) {
      id
      timestamp
      amount
      assetGav
      validPrice
      asset {
        id
        symbol
      }
    }
  }
`;
