import gql from 'graphql-tag';

export const ManagerListQuery = gql`
  query ManagerListQuery {
    fundManagers(orderBy: id, first: 1000) {
      id
      createdAt
      funds {
        id
        name
      }
    }
  }
`;
