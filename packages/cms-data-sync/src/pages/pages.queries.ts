import { gql } from 'graphql-tag';

export const pagesQuery = gql`
  query FetchPages {
    queryPagesContents(top: 100) {
      id
      status
      flatData {
        title
        path
        shortText
        text
        link
        linkText
      }
    }
  }
`;
