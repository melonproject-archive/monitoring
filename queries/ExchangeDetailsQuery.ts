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
        orderAddress0
        orderAddress1
        orderAddress2 {
          id
          symbol
        }
        orderAddress3 {
          id
          symbol
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
