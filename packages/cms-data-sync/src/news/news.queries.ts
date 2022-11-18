import { gql } from 'graphql-tag';

export const newsQuery = gql`
  query FetchNews {
    queryNewsAndEventsContents {
      id
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
