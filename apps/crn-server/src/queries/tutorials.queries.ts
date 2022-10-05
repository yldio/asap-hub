import { gql } from 'graphql-tag';

export const tutorialsQueryFragment = gql`
  fragment TutorialsContent on Tutorials {
    id
    created
    flatData {
      title
      shortText
      text
      thumbnail {
        id
      }
      link
      linkText
    }
  }
`;
