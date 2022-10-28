import { gql } from 'graphql-tag';

export const FETCH_NEWS = gql`
  query FetchNews {
    newsCollection {
      items {
        title
        shortText
        frequency
        externalLink
        externalLinkText
      }
    }
  }
`;
