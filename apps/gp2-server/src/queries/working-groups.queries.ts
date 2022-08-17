import { gql } from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    flatData {
      title
      shortDescription
      leadingMembers
    }
  }
`;

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups {
    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {
      total
      items {
        ...WorkingGroupContent
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;
