/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const manuscriptContentQueryFragment = gql`
  fragment ManuscriptsContent on Manuscripts {
    sys {
      id
    }
    title
    status
    count
    versionsCollection(limit: 20, order: sys_firstPublishedAt_DESC) {
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        type
        lifecycle
        description
        count
        manuscriptFile {
          sys {
            id
          }
          fileName
          url
        }
        keyResourceTable {
          sys {
            id
          }
          fileName
          url
        }
        additionalFilesCollection(limit: 10) {
          items {
            sys {
              id
            }
            fileName
            url
          }
        }
        preprintDoi
        publicationDoi
        requestingApcCoverage
        submitterName
        submissionDate
        otherDetails
        acknowledgedGrantNumber
        acknowledgedGrantNumberDetails {
          sys {
            id
          }
        }
        asapAffiliationIncluded
        asapAffiliationIncludedDetails {
          sys {
            id
          }
        }
        manuscriptLicense
        manuscriptLicenseDetails {
          sys {
            id
          }
        }
        datasetsDeposited
        datasetsDepositedDetails {
          sys {
            id
          }
        }
        codeDeposited
        codeDepositedDetails {
          sys {
            id
          }
        }
        protocolsDeposited
        protocolsDepositedDetails {
          sys {
            id
          }
        }
        labMaterialsRegistered
        labMaterialsRegisteredDetails {
          sys {
            id
          }
        }
        availabilityStatement
        availabilityStatementDetails {
          sys {
            id
          }
        }
        teamsCollection(limit: 10) {
          items {
            sys {
              id
            }
            displayName
            inactiveSince
          }
        }
        labsCollection(limit: 10) {
          items {
            sys {
              id
            }
            name
          }
        }
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
        updatedBy {
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
        firstAuthorsCollection(limit: 15) {
          items {
            __typename
            ... on ExternalAuthors {
              sys {
                id
              }
              name
              email
            }
            ... on Users {
              sys {
                id
              }
              avatar {
                url
              }
              firstName
              lastName
              nickname
              email
            }
          }
        }
        additionalAuthorsCollection(limit: 15) {
          items {
            __typename
            ... on ExternalAuthors {
              sys {
                id
              }
              name
              email
            }
            ... on Users {
              sys {
                id
              }
              avatar {
                url
              }
              firstName
              lastName
              nickname
              email
            }
          }
        }
        correspondingAuthorCollection(limit: 1) {
          items {
            __typename
            ... on ExternalAuthors {
              sys {
                id
              }
              name
              email
            }
            ... on Users {
              sys {
                id
              }
              avatar {
                url
              }
              firstName
              lastName
              nickname
              email
            }
          }
        }
        linkedFrom {
          complianceReportsCollection(limit: 1) {
            items {
              sys {
                id
                firstPublishedAt
              }
              url
              description
              count
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
              discussion {
                sys {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const FETCH_MANUSCRIPT_BY_ID = gql`
  query FetchManuscriptById($id: String!) {
    manuscripts(id: $id) {
      ...ManuscriptsContent
      teamsCollection(limit: 10) {
        items {
          sys {
            id
          }
        }
      }
    }
  }
  ${manuscriptContentQueryFragment}
`;

export const FETCH_MANUSCRIPTS_BY_TEAM_ID = gql`
  query FetchManuscriptsByTeamId($id: String!) {
    teams(id: $id) {
      linkedFrom {
        manuscriptsCollection(limit: 500) {
          items {
            teamsCollection {
              items {
                sys {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
