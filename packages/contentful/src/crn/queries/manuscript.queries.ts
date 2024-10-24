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
    versionsCollection(limit: 20, order: sys_publishedAt_DESC) {
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        type
        lifecycle
        description
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
          message {
            text
          }
        }
        asapAffiliationIncluded
        asapAffiliationIncludedDetails {
          message {
            text
          }
        }
        manuscriptLicense
        manuscriptLicenseDetails {
          message {
            text
          }
        }
        datasetsDeposited
        datasetsDepositedDetails {
          message {
            text
          }
        }
        codeDeposited
        codeDepositedDetails {
          message {
            text
          }
        }
        protocolsDeposited
        protocolsDepositedDetails {
          message {
            text
          }
        }
        labMaterialsRegistered
        labMaterialsRegisteredDetails {
          message {
            text
          }
        }
        availabilityStatement
        availabilityStatementDetails {
          message {
            text
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
        linkedFrom {
          complianceReportsCollection(limit: 1) {
            items {
              url
              description
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
