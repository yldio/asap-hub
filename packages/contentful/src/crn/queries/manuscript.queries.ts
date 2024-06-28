/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const manuscriptContentQueryFragment = gql`
  fragment ManuscriptsContent on Manuscripts {
    sys {
      id
    }
    title
    versionsCollection(limit: 20, order: sys_publishedAt_DESC) {
      items {
        sys {
          id
          publishedAt
        }
        type
        lifecycle
        preprintDoi
        publicationDoi
        requestingApcCoverage
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
