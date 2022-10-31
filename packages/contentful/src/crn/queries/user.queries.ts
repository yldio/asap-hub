import { gql } from 'graphql-tag';

export const FETCH_USERS = gql`
  query FetchUsers {
    usersCollection {
      items {
        id
      }
    }
  }
`;
