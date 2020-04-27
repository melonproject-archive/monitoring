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
      calls(orderBy: timestamp, orderDirection: "desc", first: 1000) {
        id
      }
      tradings(first: 1000) {
        id
        fund {
          id
        }
      }
    }
  }
`;

export const TradeListQuery = gql`
  query TradeListQuery($limit: Int!, $skip: Int!) {
    trades(orderBy: timestamp, orderDirection: "desc", first: $limit, skip: $skip) {
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
  }
`;
