import gql from 'graphql-tag';

export const LastPriceUpdateQuery = gql`
  query LastPriceUpdateQuery {
    state(id: "0x") {
      id
      lastPriceUpdate
    }
  }
`;

export const AmguConsumedQuery = gql`
  query AmguConsumedQuery {
    state(id: "0x") {
      id
      currentEngine {
        id
        amguPrice
        totalAmguConsumed
      }
    }
  }
`;

export const EngineQuery = gql`
  query EngineQuery($limit: Int!) {
    state(id: "0x") {
      id
      lastPriceUpdate
      currentEngine {
        id
        amguPrice
        totalAmguConsumed
        frozenEther
        liquidEther
        lastThaw
        thawingDelay
        totalEtherConsumed
        totalAmguConsumed
        totalMlnBurned
        mlnTotalSupply
        premiumPercent
        lastUpdate
        etherEvents(orderBy: timestamp) {
          id
          timestamp
          event
          amount
        }
      }
    }

    amguPayments(orderBy: timestamp, first: $limit) {
      id
      amount
      timestamp
    }
  }
`;

export const AmguPaymentsQuery = gql`
  query AmguPaymentsQuery($limit: Int!, $skip: Int!) {
    amguPayments(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      amount
      timestamp
    }
  }
`;
