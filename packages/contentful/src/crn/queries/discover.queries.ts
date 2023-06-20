/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { pagesContentQueryFragment } from './pages.queries';
import { tutorialsContentQueryFragment } from './tutorials.queries';

const usersContentQueryFragment = gql`
  fragment PartialUsersContent on Users {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }

    email
    firstName
    institution
    jobTitle
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
        pagesCollection(limit: 20) {
          items {
            ...PageContent
          }
        }
        trainingCollection(limit: 20) {
          items {
            ...TutorialsContent
          }
        }
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
  ${pagesContentQueryFragment}
  ${tutorialsContentQueryFragment}
  ${usersContentQueryFragment}
`;
