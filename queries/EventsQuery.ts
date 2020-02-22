import gql from 'graphql-tag';

export const EventsQuery = gql`
  query EventsQuery($limit: Int!, $skip: Int!) {
    events(first: $limit, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      name
      from
      hash
      block
      contract {
        id
      }
      parameters {
        id
        name
        value
      }
    }
  }
`;
