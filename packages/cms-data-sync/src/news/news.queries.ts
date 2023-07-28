import { gql } from 'graphql-tag';

export const newsQuery = gql`
  query FetchNews {
    queryNewsAndEventsContents(top: 100) {
      id
      created
      status
      flatData {
        title
        shortText
        text
        thumbnail {
          id
          fileName
          thumbnailUrl
          mimeType
          fileType
        }
        frequency
        link
        linkText
      }
    }
  }
`;
