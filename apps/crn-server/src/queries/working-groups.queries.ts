import gql from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    lastModified
    flatData {
      title
      description
      externalLink
      shortText
      complete
      deliverables {
        status
        description
      }
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
      orderby: "data/title/iv"
    ) {
      total
      items {
        ...WorkingGroupContent
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;
