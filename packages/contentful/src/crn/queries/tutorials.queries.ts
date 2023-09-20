/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const tutorialsContentQueryFragment = gql`
  fragment TutorialsContent on Tutorials {
    sys {
      id
    }
    publishDate
    addedDate
    lastUpdated
    datePublished
    asapFunded
    usedInAPublication
    sharingStatus
    title
    shortText
    thumbnail {
      url
    }
    link
    linkText
    text {
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
    authorsCollection(limit: 10) {
      items {
        __typename
        ... on ExternalAuthors {
          sys {
            id
          }
          name
          orcid
        }
        ... on Users {
          sys {
            id
          }
          firstName
          lastName
          email
          onboarded
          orcid
          alumniSinceDate
          avatar {
            url
          }
        }
      }
    }
    teamsCollection(limit: 20) {
      items {
        sys {
          id
        }
        displayName
      }
    }
    tagsCollection(limit: 20) {
      items {
        name
      }
    }
    linkedFrom {
      tutorialsCollection(limit: 20, order: [addedDate_ASC]) {
        items {
          sys {
            id
          }
          title
          publishDate
        }
      }
    }
    relatedTutorialsCollection(limit: 20) {
      items {
        sys {
          id
        }
        title
        publishDate
      }
    }
    relatedEventsCollection(limit: 10) {
      items {
        sys {
          id
        }
        title
        endDate
      }
    }
  }
`;

export const FETCH_TUTORIAL_BY_ID = gql`
  query FetchTutorialById($id: String!) {
    tutorials(id: $id) {
      ...TutorialsContent
    }
  }
  ${tutorialsContentQueryFragment}
`;
