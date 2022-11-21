import gql from 'graphql-tag';

export const FETCH_WORKING_GROUP = gql`
  query FetchWorkingGroup($id: String!) {
    findWorkingGroupsContent(id: $id) {
      id
      lastModified
      flatData {
        title
        description
        externalLink
        externalLinkText
      }
    }
  }
`;
