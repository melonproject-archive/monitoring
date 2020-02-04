import gql from 'graphql-tag';

export const ContractEventsQuery = gql`
  query ContractEventsQuery($contracts: [String!]!) {
    events(where: { contract_in: $contracts }, orderBy: timestamp, orderDirection: desc) {
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
