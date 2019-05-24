import gql from 'graphql-tag';

export default gql`
  query FundOverviewQuery {
    funds(orderBy: name) {
      id
      name
      gav
      grossSharePrice
      isShutdown
      creationTime
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
