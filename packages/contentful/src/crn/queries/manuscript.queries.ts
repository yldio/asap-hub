/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { discussionContentQueryFragment } from './discussions.queries';

export const manuscriptContentQueryFragment = gql`
  fragment ManuscriptsContent on Manuscripts {
    sys {
      id
      publishedVersion
    }
    title
    status
    count
    apcRequested
    apcAmountPaid
    assignedUsersCollection(limit: 30) {
      items {
        sys {
          id
        }
        firstName
        lastName
        avatar {
          url
        }
      }
    }
    versionsCollection(limit: 10, order: sys_firstPublishedAt_DESC) {
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        type
        lifecycle
        description
        shortDescription
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
        otherDetails
        acknowledgedGrantNumber
        acknowledgedGrantNumberDetails
        asapAffiliationIncluded
        asapAffiliationIncludedDetails
        manuscriptLicense
        manuscriptLicenseDetails
        datasetsDeposited
        datasetsDepositedDetails
        codeDeposited
        codeDepositedDetails
        protocolsDeposited
        protocolsDepositedDetails
        labMaterialsRegistered
        labMaterialsRegisteredDetails
        availabilityStatement
        availabilityStatementDetails
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
            labPi {
              sys {
                id
              }
              teamsCollection(limit: 3) {
                items {
                  inactiveSinceDate
                  team {
                    sys {
                      id
                    }
                    inactiveSince
                  }
                }
              }
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
              teamsCollection(limit: 3) {
                items {
                  team {
                    sys {
                      id
                    }
                  }
                }
              }
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
              teamsCollection(limit: 3) {
                items {
                  team {
                    sys {
                      id
                    }
                  }
                }
              }
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
              teamsCollection(limit: 3) {
                items {
                  team {
                    sys {
                      id
                    }
                  }
                }
              }
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
          }
        }
      }
    }
  }
`;

export const FETCH_MANUSCRIPT_BY_ID = gql`
  query FetchManuscriptById($id: String!, $userId: String) {
    manuscripts(id: $id) {
      ...ManuscriptsContent
      discussionsCollection(limit: 10) {
        total
        items {
          ...DiscussionsContent
          readByCollection(limit: 1, where: { sys: { id: $userId } }) {
            total
          }
        }
      }
      teamsCollection(limit: 10) {
        items {
          sys {
            id
          }
          teamId
          grantId
        }
      }
    }
  }
  ${manuscriptContentQueryFragment}
  ${discussionContentQueryFragment}
`;

export const FETCH_MANUSCRIPTS = gql`
  query FetchManuscripts($limit: Int, $skip: Int, $where: ManuscriptsFilter) {
    manuscriptsCollection(limit: $limit, skip: $skip, where: $where) {
      total
      items {
        sys {
          id
        }
        title
        status
        count
        apcRequested
        apcAmountPaid
        assignedUsersCollection(limit: 30) {
          items {
            sys {
              id
            }
            firstName
            lastName
            avatar {
              url
            }
          }
        }
        teamsCollection(limit: 15) {
          items {
            sys {
              id
            }
            displayName
            teamId
            grantId
          }
        }
        versionsCollection(limit: 1, order: sys_firstPublishedAt_DESC) {
          items {
            sys {
              id
              publishedAt
            }
            type
            lifecycle
            count
          }
        }
      }
    }
  }
`;

export const FETCH_MANUSCRIPT_NOTIFICATION_DETAILS = gql`
  query FetchManuscriptNotificationDetails($id: String!) {
    manuscripts(id: $id) {
      sys {
        id
      }
      title
      count
      teamsCollection(limit: 1) {
        items {
          sys {
            id
          }
          displayName
          teamId
          grantId
        }
      }
      assignedUsersCollection(limit: 30) {
        items {
          firstName
          lastName
        }
      }
      versionsCollection(limit: 1, order: sys_firstPublishedAt_DESC) {
        items {
          sys {
            id
            publishedAt
          }
          teamsCollection(limit: 10) {
            items {
              sys {
                id
              }
              displayName
              inactiveSince
              linkedFrom {
                teamMembershipCollection(limit: 100) {
                  items {
                    role
                    inactiveSinceDate
                    linkedFrom {
                      usersCollection(limit: 1) {
                        items {
                          alumniSinceDate
                          email
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          firstAuthorsCollection(limit: 15) {
            items {
              __typename
              ... on ExternalAuthors {
                email
              }
              ... on Users {
                email
              }
            }
          }
          additionalAuthorsCollection(limit: 15) {
            items {
              __typename
              ... on ExternalAuthors {
                email
              }
              ... on Users {
                email
              }
            }
          }
          correspondingAuthorCollection(limit: 1) {
            items {
              __typename
              ... on ExternalAuthors {
                email
              }
              ... on Users {
                email
              }
            }
          }
          labsCollection(limit: 10) {
            items {
              labPi {
                alumniSinceDate
                email
              }
            }
          }
          type
          lifecycle
          count
        }
      }
    }
  }
`;

export const FETCH_MANUSCRIPTS_BY_TEAM_ID = gql`
  query FetchManuscriptsByTeamId($id: String!) {
    teams(id: $id) {
      linkedFrom {
        manuscriptsCollection(limit: 500, order: count_DESC) {
          items {
            teamsCollection(limit: 1) {
              items {
                sys {
                  id
                }
              }
            }
            count
          }
        }
      }
    }
  }
`;

export const FETCH_MANUSCRIPT_VERSION_COUNT_BY_ID = gql`
  query FetchManuscriptVersionCountById($id: String!) {
    manuscripts(id: $id) {
      versionsCollection(limit: 1, order: count_DESC) {
        items {
          count
        }
      }
    }
  }
`;
