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
  query EngineQuery {
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
      }
    }
  }
`;

export const EngineEtherEventsQuery = gql`
  query EngineEtherEventsQuery {
    engineEtherEvents(orderBy: timestamp, first: 1000) {
      id
      timestamp
      event
      amount
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
