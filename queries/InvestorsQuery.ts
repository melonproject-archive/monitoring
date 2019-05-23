import gql from 'graphql-tag';

export default gql`
  query InvestorsQuery {
    investors(orderBy: id) {
      id
    }

    investorCounts(orderBy: timestamp) {
      numberOfInvestors
      timestamp
    }
  }
`;
