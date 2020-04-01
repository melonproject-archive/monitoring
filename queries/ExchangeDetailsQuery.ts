import gql from 'graphql-tag';

export default gql`
  query ExchangeDetailsQuery($exchange: ID!) {
    exchange(id: $exchange) {
      id
      name
      adapter {
        id
        takesCustody
      }
      # tradings {
      #   fund {
      #     id
      #     name
      #   }
      #   calls {
      #     id
      #   }
      # }
      trades(orderBy: timestamp, orderDirection: "desc") {
        id
        timestamp
        exchange {
          id
          name
        }
        trading {
          id
          fund {
            id
            name
          }
        }
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
      calls {
        id
        timestamp
        trading {
          fund {
            id
            name
          }
        }
        methodSignature
        methodName
        orderAddress0
        orderAddress1
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
        orderAddress4
        orderAddress5
        orderValue0
        orderValue1
        orderValue2
        orderValue3
        orderValue4
        orderValue5
        orderValue6
        orderValue7
        identifier
        makerAssetData
        takerAssetData
        signature
      }
    }
  }
`;
