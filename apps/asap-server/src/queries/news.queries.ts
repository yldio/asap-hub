import { gql } from 'graphql-tag';

export const newsQueryFragment = gql`
  fragment News on NewsAndEvents {
    id
    created
    lastModified
    flatData {
      title
      shortText
      text
      type
      thumbnail {
        id
      }
      link
      linkText
    }
  }
`;
