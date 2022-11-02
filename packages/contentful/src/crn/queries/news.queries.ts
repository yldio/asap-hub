import { gql } from 'graphql-tag';

export const FETCH_NEWS = gql`
  query FetchNews {
    newsCollection {
      items {
        id
        title
        shortText
        frequency
        link
        linkText
      }
    }
  }
`;
