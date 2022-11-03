import { gql } from 'graphql-tag';

export const FETCH_NEWS = gql`
  query FetchNews {
    newsCollection {
      items {
        sys {
          firstPublishedAt
        }
        id
        title
        shortText
        frequency
        link
        linkText
        thumbnail {
          url
        }
        text {
          json
        }
      }
    }
  }
`;
