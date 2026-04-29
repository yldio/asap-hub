/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { researchOutputContentQueryFragment } from './research-outputs.queries';

const userAuthorsContentQueryFragment = gql`
  fragment UserAuthorsContent on Users {
    sys {
      id
    }
    firstName
    nickname
    lastName
    email
    onboarded
    orcid
    alumniSinceDate
    avatar {
      url
    }
  }
`;

const versionsContentQueryFragment = gql`
  fragment VersionsContent on ManuscriptVersions {
    sys {
      id
    }
    description
    shortDescription
    url
    type
    lifecycle
    count
    publicationDoi
    preprintDoi
    linkedFrom {
      researchOutputsCollection(limit: 1) {
        total
      }
      researchOutputVersionsCollection(limit: 1) {
        total
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
    teamsCollection(limit: 10) {
      items {
        sys {
          id
        }
        displayName
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
          orcid
        }
        ... on Users {
          ...UserAuthorsContent
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
          orcid
        }
        ... on Users {
          ...UserAuthorsContent
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
          orcid
        }
        ... on Users {
          ...UserAuthorsContent
        }
      }
    }
  }
  ${userAuthorsContentQueryFragment}
`;

export const FETCH_MANUSCRIPT_VERSION_BY_ID = gql`
  query FetchManuscriptVersionById($id: String!) {
    manuscriptVersions(id: $id) {
      linkedFrom {
        manuscriptsCollection(limit: 1) {
          items {
            sys {
              id
            }
            title
            url
            count
            relatedResearchOutput {
              sys {
                id
              }
            }
            teamsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                linkedFrom {
                  projectMembershipCollection(limit: 1) {
                    items {
                      linkedFrom {
                        projectsCollection(limit: 1) {
                          items {
                            projectId
                            grantId
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            impact {
              sys {
                id
              }
              name
            }
            categoriesCollection(limit: 2) {
              items {
                sys {
                  id
                }
                name
              }
            }
            versionsCollection(
              order: count_DESC
              where: {
                lifecycle_in: [
                  "Preprint"
                  "Publication"
                  "Publication with addendum or corrigendum"
                ]
              }
            ) {
              items {
                ...VersionsContent
              }
            }
          }
        }
      }
    }
  }
  ${versionsContentQueryFragment}
`;

export const FETCH_COMPLIANCE_MANUSCRIPT_VERSIONS = gql`
  query FetchComplianceManuscriptVersions(
    $limit: Int
    $skip: Int
    $where: ManuscriptVersionsFilter
  ) {
    manuscriptVersionsCollection(limit: $limit, skip: $skip, where: $where) {
      total
      items {
        sys {
          id
          publishedAt
        }
        url
        type
        lifecycle
        preprintDoi
        description
        shortDescription
        count
        publicationDoi
        otherDetails
        manuscriptFile {
          url
        }
        keyResourceTable {
          url
        }
        additionalFilesCollection(limit: 5) {
          items {
            url
          }
        }
        firstAuthorsCollection(limit: 15) {
          items {
            __typename
            ... on ExternalAuthors {
              name
            }
            ... on Users {
              firstName
              middleName
              lastName
              nickname
            }
          }
        }
        correspondingAuthorCollection(limit: 1) {
          items {
            __typename
            ... on ExternalAuthors {
              name
            }
            ... on Users {
              firstName
              middleName
              lastName
              nickname
            }
          }
        }
        additionalAuthorsCollection(limit: 15) {
          items {
            __typename
            ... on ExternalAuthors {
              name
            }
            ... on Users {
              firstName
              middleName
              lastName
              nickname
            }
          }
        }
        teamsCollection(limit: 10) {
          items {
            displayName
          }
        }
        labsCollection(limit: 10) {
          items {
            name
          }
        }
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
        linkedFrom {
          complianceReportsCollection(limit: 1) {
            items {
              url
              description
            }
          }
          manuscriptsCollection(limit: 1) {
            items {
              title
              url
              count
              status
              assignedUsersCollection(limit: 5) {
                items {
                  firstName
                  lastName
                  nickname
                  middleName
                }
              }
              teamsCollection(limit: 1) {
                items {
                  linkedFrom {
                    projectMembershipCollection(limit: 1) {
                      items {
                        linkedFrom {
                          projectsCollection(limit: 1) {
                            items {
                              projectId
                              grantId
                              title
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              project {
                sys {
                  id
                }
                projectId
                grantId
                title
              }
              impact {
                name
              }
              categoriesCollection(limit: 2) {
                items {
                  name
                }
              }
              apcRequested
              apcAmountRequested
              apcCoverageRequestStatus
              apcAmountPaid
              declinedReason
            }
          }
        }
      }
    }
  }
`;

export const FETCH_VERSIONS_BY_MANUSCRIPT = gql`
  query FetchVersionsByManuscript(
    $limit: Int
    $skip: Int
    $where: ManuscriptsFilter
  ) {
    manuscriptsCollection(limit: $limit, skip: $skip, where: $where) {
      total
      items {
        sys {
          id
        }
        title
        url
        count
        relatedResearchOutput {
          sys {
            id
          }
        }
        teamsCollection(limit: 1) {
          items {
            sys {
              id
            }
            linkedFrom {
              projectMembershipCollection(limit: 1) {
                items {
                  linkedFrom {
                    projectsCollection(limit: 1) {
                      items {
                        projectId
                        grantId
                      }
                    }
                  }
                }
              }
            }
          }
        }
        impact {
          sys {
            id
          }
          name
        }
        categoriesCollection(limit: 2) {
          items {
            sys {
              id
            }
            name
          }
        }
        versionsCollection(
          order: count_DESC
          where: {
            lifecycle_in: [
              "Preprint"
              "Publication"
              "Publication with addendum or corrigendum"
            ]
          }
        ) {
          items {
            ...VersionsContent
          }
        }
      }
    }
  }
  ${versionsContentQueryFragment}
`;

export const FETCH_RESEARCH_OUTPUT_BY_MANUSCRIPT_VERSION_ID = gql`
  query FetchResearchOutputByManuscriptVersionId(
    $id: String!
    $fetchPMs: Boolean = false
    $singleOutput: Boolean = false
    $relatedResearchWhere: ResearchOutputsFilter = {}
  ) {
    manuscriptVersions(id: $id) {
      linkedFrom {
        researchOutputsCollection(limit: 1) {
          items {
            ...ResearchOutputsContent
          }
        }
      }
    }
  }
  ${researchOutputContentQueryFragment}
`;
