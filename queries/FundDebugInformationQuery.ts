import gql from 'graphql-tag';

export const FundDebugInformationQuery = gql`
  query FundDebugInformationQuery($fund: ID!) {
    eventHistories(where: { fund: $fund }, orderBy: timestamp, orderDirection: desc) {
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
