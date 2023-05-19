/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const workingGroupsContentQueryFragment = gql`
  fragment WorkingGroupsContentData on WorkingGroups {
    sys {
      id
    }
    title
    shortDescription
    description
    primaryEmail
    secondaryEmail
    leadingMembers
    membersCollection {
      total
      items {
        sys {
          id
        }
        role
        user {
          sys {
            id
          }
          firstName
          lastName
          onboarded
          avatar {
            url
          }
        }
      }
    }
    milestonesCollection {
      total
      items {
        sys {
          id
        }
        description
        externalLink
        status
        title
      }
    }
    resourcesCollection {
      total
      items {
        sys {
          id
        }
        type
        title
        description
        externalLink
      }
    }
    calendar {
      sys {
        id
      }
      name
    }
  }
`;

export const FETCH_WORKING_GROUP_BY_ID = gql`
  query FetchWorkingGroupById($id: String!) {
    workingGroups(id: $id) {
      ...WorkingGroupsContentData
    }
  }
  ${workingGroupsContentQueryFragment}
`;
