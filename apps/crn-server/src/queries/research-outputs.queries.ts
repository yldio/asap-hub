import gql from 'graphql-tag';

export const researchOutputContentQueryFragment = gql`
  fragment ResearchOutputContent on ResearchOutputs {
    id
    created
    lastModified
    version
    status
    flatData {
      title
      documentType
      type
      description
      descriptionMD
      link
      addedDate
      publishDate
      doi
      labCatalogNumber
      accession
      rrid
      tags
      lastUpdatedPartial
      usageNotes
      sharingStatus
      asapFunded
      usedInAPublication
      authors {
        __typename
        ... on Users {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            biography
            degree
            email
            contactEmail
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
            country
            city
            onboarded
            orcid
            orcidLastModifiedDate
            orcidLastSyncDate
            orcidWorks {
              doi
              id
              lastModifiedDate
              publicationDate
              title
              type
            }
            questions {
              question
            }
            expertiseAndResourceTags
            expertiseAndResourceDescription
            teams {
              inactiveSinceDate
              role
              id {
                id
                flatData {
                  displayName
                  proposal {
                    id
                  }
                  inactiveSince
                }
              }
            }
            social {
              github
              googleScholar
              linkedIn
              researcherId
              researchGate
              twitter
              website1
              website2
            }
            role
            responsibilities
            researchInterests
            reachOut
            labs {
              id
              flatData {
                name
              }
            }
            alumniSinceDate
            alumniLocation
          }
        }
        ... on ExternalAuthors {
          id
          created
          lastModified
          version
          flatData {
            name
            orcid
          }
        }
      }
      relatedResearch {
        id
        flatData {
          title
          type
          documentType
          teams {
            id
            flatData {
              displayName
            }
          }
        }
      }
      labs {
        id
        flatData {
          name
        }
      }
      workingGroups {
        id
        flatData {
          title
        }
      }
      teams @include(if: $withTeams) {
        id
        created
        lastModified
        version
        flatData {
          displayName
          inactiveSince
        }
        referencingUsersContents {
          flatData {
            email
            teams {
              role
              id {
                id
              }
            }
          }
        }
      }
      methods {
        flatData {
          name
        }
      }
      organisms {
        flatData {
          name
        }
      }
      environments {
        flatData {
          name
        }
      }
      subtype {
        flatData {
          name
        }
      }
      keywords {
        flatData {
          name
        }
      }
    }
  }
`;

export const FETCH_RESEARCH_OUTPUT = gql`
  query FetchResearchOutput($id: String!, $withTeams: Boolean!) {
    findResearchOutputsContent(id: $id) {
      ...ResearchOutputContent
    }
  }
  ${researchOutputContentQueryFragment}
`;

export const FETCH_RESEARCH_OUTPUTS = gql`
  query FetchResearchOutputs(
    $top: Int
    $skip: Int
    $filter: String
    $withTeams: Boolean!
  ) {
    queryResearchOutputsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "created desc"
    ) {
      total
      items {
        ...ResearchOutputContent
      }
    }
  }
  ${researchOutputContentQueryFragment}
`;
