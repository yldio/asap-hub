import { gql } from 'graphql-tag';

export const tutorialsContentQueryFragment = gql`
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

export const FETCH_TUTORIAL = gql`
  query FetchTutorials($id: String!) {
    findTutorialsContent(id: $id) {
      ...TutorialsContent
    }
  }
  ${tutorialsContentQueryFragment}
`;
