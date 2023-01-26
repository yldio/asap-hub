import { gql } from 'graphql-tag';

export const newsQueryFragment = gql`
  fragment News on NewsAndEvents {
    id
    created
    lastModified
    version
    flatData {
      title
      text
      link
      linkText
    }
  }
`;
