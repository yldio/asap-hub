import { gql } from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupData on WorkingGroups {
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
            onboarded
          }
        }
      }
      milestones {
        title
        description
        status
        link
      }
      resources {
        type
        title
        description
        externalLink
      }
      calendars {
        id
        flatData {
          name
        }
      }
    }
  }
`;

export const FETCH_WORKING_GROUP = gql`
  query FetchWorkingGroup($id: String!) {
    findWorkingGroupsContent(id: $id) {
      ...WorkingGroupData
    }
  }
  ${workingGroupContentQueryFragment}
`;

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups {
    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {
      total
      items {
        ...WorkingGroupData
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;
