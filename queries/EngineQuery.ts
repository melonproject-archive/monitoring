import gql from 'graphql-tag';

export const EngineQuery = gql`
  query EngineQuery($limit: Int!) {
    state(id: "0x") {
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
