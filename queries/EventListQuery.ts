import gql from 'graphql-tag';

export const EventListFundQuery = gql`
  query EventListFundQuery($address: ID!) {
    eventHistories(where: { fund: $address }, orderBy: timestamp, orderDirection: desc) {
      timestamp
      event
      contract
      contractAddress
      params {
        name
        value
      }
    }
  }
`;

export const EventListContractQuery = gql`
  query EventListContractQuery($address: String!) {
    eventHistories(where: { contractAddress: $address }, orderBy: timestamp, orderDirection: desc) {
      timestamp
      event
      contract
      contractAddress
      params {
        name
        value
      }
    }
  }
`;
