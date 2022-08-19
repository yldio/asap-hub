import { gql } from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    flatData {
      title
      shortDescription
      leadingMembers
      members {
        role
        user {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            firstName
            lastName
          }
        }
      }
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
