import gql from 'graphql-tag';

export const ManagerDetailsQuery = gql`
  query ManagerDetailsQuery($manager: ID!) {
    fundManager(id: $manager) {
      id
      funds {
        id
        createdAt
        name
        nav
        version {
          name
        }
      }
    }
  }
`;
