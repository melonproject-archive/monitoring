import gql from 'graphql-tag';

export default gql`
  query FundDetailsQuery($fund: ID!) {
    fund(id: $fund) {
      id
      name
    }
  }
`;
