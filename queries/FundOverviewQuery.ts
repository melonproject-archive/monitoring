import gql from 'graphql-tag';

export default gql`
  query FundOverviewQuery {
    funds(orderBy: name) {
      id
      name
      gav
    }

    fundCounts(orderBy: timestamp) {
      active
      nonActive
      timestamp
    }

    aggregateValues(orderBy: timestamp) {
      timestamp
      gav
    }
  }
`;
