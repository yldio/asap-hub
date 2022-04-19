import gql from 'graphql-tag';

export const researchOutputContentQueryFragment = gql`
  fragment ResearchOutputContent on ResearchOutputs {
    id
    created
    lastModified
    version
    flatData {
      title
      documentType
      type
      description
      link
      addedDate
      publishDate
      doi
      labCatalogNumber
      accession
      rrid
      tags
      lastUpdatedPartial
      accessInstructions
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
              role
              id {
                id
                flatData {
                  displayName
                  proposal {
                    id
                  }
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
      labs {
        id
        flatData {
          name
        }
      }
    }
    referencingTeamsContents @include(if: $withTeams) {
      id
      created
      lastModified
      version
      flatData {
        displayName
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
