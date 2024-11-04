/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { discussionContentQueryFragment } from './discussions.queries';

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
          ...DiscussionsContent
        }
        asapAffiliationIncluded
        asapAffiliationIncludedDetails {
          ...DiscussionsContent
        }
        manuscriptLicense
        manuscriptLicenseDetails {
          ...DiscussionsContent
        }
        datasetsDeposited
        datasetsDepositedDetails {
          ...DiscussionsContent
        }
        codeDeposited
        codeDepositedDetails {
          ...DiscussionsContent
        }
        protocolsDeposited
        protocolsDepositedDetails {
          ...DiscussionsContent
        }
        labMaterialsRegistered
        labMaterialsRegisteredDetails {
          ...DiscussionsContent
        }
        availabilityStatement
        availabilityStatementDetails {
          ...DiscussionsContent
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
  ${discussionContentQueryFragment}
`;

export const FETCH_MANUSCRIPT_BY_ID = gql`
  query FetchManuscriptById($id: String!, $fetchReplies: Boolean = false) {
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
