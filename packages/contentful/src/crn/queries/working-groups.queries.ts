/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const workingGroupsContentQueryFragment = gql`
  fragment WorkingGroupsContent on WorkingGroups {
    sys {
      id
      publishedAt
    }
    title
    description {
      json
      links {
        entries {
          inline {
            sys {
              id
            }
            __typename
            ... on Media {
              url
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
            contentType
            width
            height
          }
        }
      }
    }
    externalLink
    shortText
    complete
    deliverablesCollection {
      items {
        description
        status
      }
    }
    membersCollection {
      items {
        __typename
        ... on WorkingGroupLeaders {
          workstreamRole
          role
          inactiveSinceDate
          user {
            sys {
              id
            }
            avatar {
              url
            }
            email
            firstName
            lastName
            alumniSinceDate
          }
        }
        __typename
        ... on WorkingGroupMembers {
          inactiveSinceDate
          user {
            sys {
              id
            }
            avatar {
              url
            }
            email
            firstName
            lastName
            alumniSinceDate
          }
        }
      }
    }
    calendars {
      sys {
        id
      }
      name
      color
      googleCalendarId
    }
  }
`;

export const FETCH_WORKING_GROUP_BY_ID = gql`
  query FetchWorkingGroupById($id: String!) {
    workingGroups(id: $id) {
      ...WorkingGroupsContent
    }
  }
  ${workingGroupsContentQueryFragment}
`;

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups(
    $limit: Int
    $skip: Int
    $order: [WorkingGroupsOrder]
    $where: WorkingGroupsFilter
  ) {
    workingGroupsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...WorkingGroupsContent
      }
    }
  }
  ${workingGroupsContentQueryFragment}
`;
