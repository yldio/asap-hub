/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchOutputContentQueryFragment = gql`
  fragment ResearchOutputsContent on ResearchOutputs {
    sys {
      id
      publishedVersion
    }
    title
    descriptionMd
    shortDescription
    changelog
    link
    addedDate
    createdDate
    lastUpdatedPartial
    documentType
    sharingStatus
    labCatalogNumber
    doi
    accession
    rrid
    asapFunded
    usedInAPublication
    type
    publishDate
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
    description {
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
    usageNotes
    statusChangedBy {
      sys {
        id
      }
      firstName
      lastName
      email
    }
    statusChangedAt
    isInReview
    authorsCollection(limit: 100) {
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
      }
    }
    teamsCollection(limit: 20) {
      items {
        sys {
          id
        }
        displayName
        researchTheme {
          name
        }
        linkedFrom {
          teamMembershipCollection @include(if: $fetchPMs) {
            items {
              role
              inactiveSinceDate
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    email
                  }
                }
              }
            }
          }
        }
      }
    }
    workingGroup {
      sys {
        id
      }
      title
    }
    methodsCollection(limit: 5) {
      items {
        name
      }
    }
    keywordsCollection(limit: 20) {
      items {
        name
      }
    }
    organismsCollection(limit: 5) {
      items {
        name
      }
    }
    environmentsCollection(limit: 5) {
      items {
        name
      }
    }
    subtype {
      name
    }
    labsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
      }
    }
    relatedResearchCollection(limit: 20, where: $relatedResearchWhere) {
      items {
        sys {
          id
        }
        title
        type
        documentType
        teamsCollection(limit: 20) @include(if: $singleOutput) {
          items {
            sys {
              id
            }
            displayName
          }
        }
        workingGroup @include(if: $singleOutput) {
          sys {
            id
          }
          title
        }
      }
    }
    linkedFrom {
      researchOutputsCollection(limit: 60, order: [addedDate_ASC]) {
        items {
          sys {
            id
          }
          title
          type
          documentType
          teamsCollection(limit: 20) @include(if: $singleOutput) {
            items {
              sys {
                id
              }
              displayName
            }
          }
          workingGroup @include(if: $singleOutput) {
            sys {
              id
            }
            title
          }
        }
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
    versionsCollection {
      items {
        sys {
          id
        }
        title
        documentType
        type
        addedDate
        link
        rrid
        accession
      }
    }
    relatedManuscriptVersion {
      sys {
        id
      }
      linkedFrom {
        manuscriptsCollection(limit: 1) {
          items {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

export const FETCH_RESEARCH_OUTPUT_BY_ID = gql`
  query FetchResearchOutputById(
    $id: String!
    $preview: Boolean
    $fetchPMs: Boolean = true
    $singleOutput: Boolean = true
    $relatedResearchWhere: ResearchOutputsFilter = {}
  ) {
    researchOutputs(id: $id, preview: $preview) {
      ...ResearchOutputsContent
    }
  }
  ${researchOutputContentQueryFragment}
`;

export const FETCH_RESEARCH_OUTPUTS = gql`
  query FetchResearchOutputs(
    $limit: Int
    $skip: Int
    $order: [ResearchOutputsOrder]
    $where: ResearchOutputsFilter
    $preview: Boolean
    $fetchPMs: Boolean = false
    $singleOutput: Boolean = false
    $relatedResearchWhere: ResearchOutputsFilter
  ) {
    researchOutputsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
      preview: $preview
    ) {
      total
      items {
        ...ResearchOutputsContent
      }
    }
  }
  ${researchOutputContentQueryFragment}
`;
