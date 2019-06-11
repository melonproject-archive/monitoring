import gql from 'graphql-tag';

export const ManagerListQuery = gql`
  query ManagerListQuery {
    fundManagers(orderBy: id) {
      id
      createdAt
      funds {
        id
        name
      }
    }
  }
`;
