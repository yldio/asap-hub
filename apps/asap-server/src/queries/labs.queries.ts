import gql from 'graphql-tag';

export const FETCH_LABS = gql`
  query FetchLabs {
    queryLabsContents {
      flatData {
        name
      }
      id
    }
  }
`;
