import gql from 'graphql-tag';

export default gql`
  query FundNamesQuery {
    funds {
      id
      name
    }
  }
`;
