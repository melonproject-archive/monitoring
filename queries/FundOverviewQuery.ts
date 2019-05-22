import gql from 'graphql-tag';

export default gql`
  query FundNamesQuery {
    funds {
      id
      name
    }

    fundCounts(orderBy: timestamp) {
      active
      nonActive
      timestamp
    }
  }
`;
