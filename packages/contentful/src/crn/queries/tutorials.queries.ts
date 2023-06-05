/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_TUTORIAL_BY_ID = gql`
  query FetchTutorialById($id: String!) {
    tutorials(id: $id) {
      sys {
        id
        firstPublishedAt
      }
      title
      shortText
      thumbnail {
        url
      }
      link
      linkText
      text {
        json
        links {
          entries {
            inline {
              sys {
                id
              }
              __typename
              ... on Media {
                url
              }
            }
          }
          assets {
            block {
              sys {
                id
              }
              url
              description
              contentType
              width
              height
            }
          }
        }
      }
    }
  }
`;
