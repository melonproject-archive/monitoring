import gql from 'graphql-tag';

export const EngineQuery = gql`
  query EngineQuery($limit: Int!) {
    state(id: "0x") {
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
        premiumPercent
        lastUpdate
        etherEvents(orderBy: timestamp) {
          timestamp
          event
          amount
        }
      }
    }

    amguPayments(orderBy: timestamp, first: $limit) {
      amount
      timestamp
    }
  }
`;

export const AmguPaymentsQuery = gql`
  query AmguPaymentsQuery($limit: Int!, $skip: Int!) {
    amguPayments(orderBy: timestamp, first: $limit, skip: $skip) {
      amount
      timestamp
    }
  }
`;
