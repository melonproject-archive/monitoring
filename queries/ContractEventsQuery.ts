import gql from 'graphql-tag';

export const ContractEventsQuery = gql`
  query ContractEventsQuery($contracts: [String!]!, $limit: Int!, $skip: Int!) {
    events(where: { contract_in: $contracts }, orderBy: timestamp, orderDirection: desc, first: $limit, skip: $skip) {
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
