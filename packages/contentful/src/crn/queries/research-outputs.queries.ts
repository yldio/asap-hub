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
    reviewRequestedBy {
      sys {
        id
      }
      firstName
      lastName
      email
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
          onboarded
          orcid
          avatar {
            url
          }
        }
      }
    }
    teamsCollection(limit: 10) {
      items {
        sys {
          id
        }
        displayName
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
    methodsCollection(limit: 20) {
      items {
        name
      }
    }
    keywordsCollection(limit: 20) {
      items {
        name
      }
    }
    organismsCollection(limit: 20) {
      items {
        name
      }
    }
    environmentsCollection(limit: 20) {
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
    relatedResearchCollection(limit: 10) {
      items {
        sys {
          id
        }
        title
        type
        documentType
        teamsCollection(limit: 10) {
          items {
            sys {
              id
            }
            displayName
          }
        }
      }
    }
    linkedFrom {
      researchOutputsCollection(limit: 10) {
        items {
          sys {
            id
          }
          title
          type
          documentType
          teamsCollection(limit: 10) {
            items {
              sys {
                id
              }
              displayName
            }
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
  }
`;

export const FETCH_RESEARCH_OUTPUT_BY_ID = gql`
  query FetchResearchOutputById(
    $id: String!
    $preview: Boolean
    $fetchPMs: Boolean = true
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
