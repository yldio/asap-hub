/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const interestGroupContentQueryFragment = gql`
  fragment InterestGroupsContent on InterestGroups {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    name
    active
    tags
    description
    slack
    googleDrive
    thumbnail {
      url
    }
    teamsCollection(limit: 50) {
      items {
        sys {
          id
          publishedAt
        }
        displayName
        inactiveSince
        expertiseAndResourceTags
        projectTitle
      }
    }
    leadersCollection(limit: 20) {
      items {
        sys {
          id
          publishedAt
        }
        user {
          sys {
            id
            publishedAt
            firstPublishedAt
          }
          firstName
          lastName
          email
          alumniSinceDate
          avatar {
            url
          }
          teamsCollection(limit: 5) {
            items {
              role
              inactiveSinceDate
              team {
                sys {
                  id
                }
                inactiveSince
                displayName
              }
            }
          }
        }
        role
        inactiveSinceDate
      }
    }
    calendar {
      sys {
        id
      }
      color
      googleCalendarId
      name
    }
  }
`;

export const FETCH_INTEREST_GROUP_BY_ID = gql`
  query FetchInterestGroupById($id: String!) {
    interestGroups(id: $id) {
      ...InterestGroupsContent
    }
  }
  ${interestGroupContentQueryFragment}
`;

export const FETCH_INTEREST_GROUPS = gql`
  query FetchInterestGroups(
    $limit: Int
    $skip: Int
    $order: [InterestGroupsOrder]
    $where: InterestGroupsFilter
  ) {
    interestGroupsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...InterestGroupsContent
      }
    }
  }
  ${interestGroupContentQueryFragment}
`;
