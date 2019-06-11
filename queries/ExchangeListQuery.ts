import gql from 'graphql-tag';

export const ExchangeListQuery = gql`
  query ExchangeListQuery($limit: Int!, $skip: Int!) {
    exchanges(orderBy: name) {
      id
      name
      adapter {
        id
        createdAt
      }
      calls(orderBy: timestamp, orderDirection: "desc") {
        id
      }
      tradings {
        fund {
          id
        }
      }
    }

    exchangeMethodCalls(orderBy: timestamp, orderDirection: "desc", first: $limit, skip: $skip) {
      timestamp
      exchange {
        name
      }
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
`;

export const ExchangeListScrapingQuery = gql`
  query ExchangeListScrapingQuery($limit: Int!, $skip: Int!) {
    exchangeMethodCalls(orderBy: timestamp, orderDirection: "desc", first: $limit, skip: $skip) {
      timestamp
      exchange {
        name
      }
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
`;
