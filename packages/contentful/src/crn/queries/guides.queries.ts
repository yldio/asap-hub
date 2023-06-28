import gql from 'graphql-tag';

export const FETCH_GUIDE = gql`
  query FetchGuide {
    guidesCollection(limit: 20) {
      items {
        title
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
`;
