import { gql } from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    flatData {
      title
      shortDescription
      leadingMembers
      description
      primaryEmail
      secondaryEmail
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

export const workingGroupNetworkQueryFragment = gql`
  fragment WorkingGroupNetworkContent on WorkingGroupNetwork {
    id
    flatData {
      complexDisease {
        ...WorkingGroupContent
      }
      monogenic {
        ...WorkingGroupContent
      }
      operational {
        ...WorkingGroupContent
      }
      support {
        ...WorkingGroupContent
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
  query FetchWorkingGroupNetwork {
    queryWorkingGroupNetworkContents {
      ...WorkingGroupNetworkContent
    }
  }
  ${workingGroupNetworkQueryFragment}
`;
