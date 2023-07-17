/* istanbul ignore file */

import gql from 'graphql-tag';

export const FETCH_GUIDE_BY_TITLE = gql`
  query FetchGuideByTitle($title: String!) {
    guideCollectionsCollection(limit: 1, where: { title: $title }) {
      items {
        guidesCollection(limit: 100) {
          items {
            title
            icon {
              asset {
                url
              }
            }
            contentCollection(limit: 100) {
              items {
                title
                text
                linkUrl
                linkText
              }
            }
          }
        }
      }
    }
  }
`;
