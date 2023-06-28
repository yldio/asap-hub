/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const workingGroupsContentQueryFragment = gql`
  fragment WorkingGroupsContentData on WorkingGroups {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    title
    shortDescription
    description {
      json
    }
    primaryEmail
    secondaryEmail
    leadingMembers
    membersCollection(limit: 50) {
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
    milestonesCollection(limit: 10) {
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
    resourcesCollection(limit: 10) {
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

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups {
    workingGroupsCollection(limit: 50) {
      total
      items {
        ...WorkingGroupsContentData
      }
    }
  }
  ${workingGroupsContentQueryFragment}
`;
