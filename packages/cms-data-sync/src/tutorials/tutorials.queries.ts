import { gql } from 'graphql-tag';

export const tutorialsQuery = gql`
  query FetchTutorials($take: Int, $skip: Int) {
    queryTutorialsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        flatData {
          title
          shortText
          text
          thumbnail {
            id
            fileName
            mimeType
            fileType
          }
          link
          linkText
        }
      }
    }
  }
`;
