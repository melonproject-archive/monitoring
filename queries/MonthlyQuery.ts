import gql from 'graphql-tag';

export const MonthlyInvestorCountQuery = gql`
  query MonthlyInvestorQuery(
    $d0: BigInt!
    $d1: BigInt!
    $d2: BigInt!
    $d3: BigInt!
    $d4: BigInt!
    $d5: BigInt!
    $d6: BigInt!
    $d7: BigInt!
    $d8: BigInt!
    $d9: BigInt!
    $d10: BigInt!
    $d11: BigInt!
    $d12: BigInt!
  ) {
    m0: investorCounts(where: { timestamp_lt: $d0 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m1: investorCounts(where: { timestamp_lt: $d1 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m2: investorCounts(where: { timestamp_lt: $d2 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m3: investorCounts(where: { timestamp_lt: $d3 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m4: investorCounts(where: { timestamp_lt: $d4 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m5: investorCounts(where: { timestamp_lt: $d5 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m6: investorCounts(where: { timestamp_lt: $d6 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m7: investorCounts(where: { timestamp_lt: $d7 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m8: investorCounts(where: { timestamp_lt: $d8 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m9: investorCounts(where: { timestamp_lt: $d9 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m10: investorCounts(where: { timestamp_lt: $d10 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m11: investorCounts(where: { timestamp_lt: $d11 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m12: investorCounts(where: { timestamp_lt: $d12 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
  }
`;

export const MonthlyInvestmentCountQuery = gql`
  query MonthlyInvestmentQuery(
    $d0: BigInt!
    $d1: BigInt!
    $d2: BigInt!
    $d3: BigInt!
    $d4: BigInt!
    $d5: BigInt!
    $d6: BigInt!
    $d7: BigInt!
    $d8: BigInt!
    $d9: BigInt!
    $d10: BigInt!
    $d11: BigInt!
    $d12: BigInt!
  ) {
    m0: investmentCounts(where: { timestamp_lt: $d0 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m1: investmentCounts(where: { timestamp_lt: $d1 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m2: investmentCounts(where: { timestamp_lt: $d2 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m3: investmentCounts(where: { timestamp_lt: $d3 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m4: investmentCounts(where: { timestamp_lt: $d4 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m5: investmentCounts(where: { timestamp_lt: $d5 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m6: investmentCounts(where: { timestamp_lt: $d6 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m7: investmentCounts(where: { timestamp_lt: $d7 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m8: investmentCounts(where: { timestamp_lt: $d8 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m9: investmentCounts(where: { timestamp_lt: $d9 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m10: investmentCounts(where: { timestamp_lt: $d10 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m11: investmentCounts(where: { timestamp_lt: $d11 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
    m12: investmentCounts(where: { timestamp_lt: $d12 }, orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
      timestamp
    }
  }
`;
