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
    tagsCollection(limit: 20) {
      items {
        name
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
            teamsCollection(limit: 5) @include(if: $singleWorkingGroup) {
              items {
                role
                team {
                  sys {
                    id
                  }
                  displayName
                }
              }
            }
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
            teamsCollection(limit: 5) @include(if: $singleWorkingGroup) {
              items {
                role
                team {
                  sys {
                    id
                  }
                  displayName
                }
              }
            }
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
    lastUpdated
  }
`;

export const FETCH_WORKING_GROUP_BY_ID = gql`
  query FetchWorkingGroupById(
    $id: String!
    $singleWorkingGroup: Boolean = true
  ) {
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
    $singleWorkingGroup: Boolean = false
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
