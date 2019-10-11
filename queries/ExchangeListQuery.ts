import gql from 'graphql-tag';

export const ExchangeListQuery = gql`
  query ExchangeListQuery {
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
        id
        fund {
          id
        }
      }
    }
  }
`;

export const ExchangeMethodCallListQuery = gql`
  query ExchangeMethodCallListQuery($limit: Int!, $skip: Int!) {
    exchangeMethodCalls(orderBy: timestamp, orderDirection: "desc", first: $limit, skip: $skip) {
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
      methodSignature
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
`;
