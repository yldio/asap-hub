/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const discussionContentQueryFragment = gql`
  fragment DiscussionsContent on Discussions {
    sys {
      id
      publishedVersion
    }
    title
    message {
      sys {
        publishedAt
      }
      text
      createdBy {
        sys {
          id
        }
        firstName
        nickname
        lastName
        alumniSinceDate
        avatar {
          url
        }
        teamsCollection(limit: 3) {
          items {
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
    repliesCollection(limit: 20) {
      items {
        sys {
          publishedAt
        }
        text
        createdBy {
          sys {
            id
          }
          firstName
          nickname
          lastName
          alumniSinceDate
          avatar {
            url
          }
          teamsCollection(limit: 2) {
            items {
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
`;
export const FETCH_DISCUSSION_BY_ID = gql`
  query FetchDiscussionById($id: String!) {
    discussions(id: $id) {
      ...DiscussionsContent
    }
  }
  ${discussionContentQueryFragment}
`;

export const FETCH_DISCUSSION_GRANTEE_PARTICIPANTS = gql`
  query FetchDiscussionGranteeParticipants($id: String!) {
    discussions(id: $id) {
      message(
        where: {
          createdBy: { alumniSinceDate: null, openScienceTeamMember_not: true }
        }
      ) {
        createdBy {
          email
        }
      }
      repliesCollection(
        where: {
          createdBy: { alumniSinceDate: null, openScienceTeamMember_not: true }
        }
      ) {
        items {
          createdBy {
            email
          }
        }
      }
    }
  }
`;

export const FETCH_DISCUSSION_TITLE = gql`
  query FetchDiscussionTitle($id: String!) {
    discussions(id: $id) {
      title
    }
  }
`;
