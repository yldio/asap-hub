import gql from 'graphql-tag';

export const FETCH_GUIDE = gql`
  query FetchGuide {
    queryGuideContents {
      flatData {
        title

        content {
          id
          created
          lastModified
          version
          flatData {
            title 
            text
            linkURL
            linkText
          }
        }
      }
    }
  }
`;
