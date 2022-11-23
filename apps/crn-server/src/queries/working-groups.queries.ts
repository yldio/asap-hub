import gql from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    lastModified
    flatData {
      title
      description
      externalLink
      externalLinkText
    }
  }
`;

export const FETCH_WORKING_GROUP = gql`
  query FetchWorkingGroup($id: String!) {
    findWorkingGroupsContent(id: $id) {
      ...WorkingGroupContent
    }
  }
  ${workingGroupContentQueryFragment}
`;

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups($top: Int, $skip: Int, $filter: String) {
    queryWorkingGroupsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...WorkingGroupContent
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;
