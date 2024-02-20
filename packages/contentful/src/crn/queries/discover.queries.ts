/* istanbul ignore file */

import { gql } from 'graphql-tag';

const usersContentQueryFragment = gql`
  fragment PartialUsersContent on Users {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    lastUpdated
    email
    firstName
    institution
    jobTitle
    nickname
    lastName
    avatar {
      url
    }
  }
`;

export const FETCH_DISCOVER = gql`
  query FetchDiscover {
    discoverCollection(limit: 1, order: sys_publishedAt_DESC) {
      items {
        aboutUs {
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
        membersCollection {
          items {
            ...PartialUsersContent
          }
        }
        membersTeam {
          sys {
            id
          }
        }
        scientificAdvisoryBoardCollection {
          items {
            ...PartialUsersContent
          }
        }
      }
    }
  }
  ${usersContentQueryFragment}
`;
