import gql from 'graphql-tag';

export const researchOutputContentQuery = gql(`#graphql
  fragment ResearchOutputContent on ResearchOutputs {
    id
    created
    lastModified
    flatData {
      title
      type
      subtype
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
            skills
            skillsDescription
            teams {
              role
              approach
              responsibilities
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
          flatData {
            name
            orcid
          }
        }
      }
    }
    referencingTeamsContents @include(if: $withTeams) {
      id
      created
      lastModified
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
`);

export const FETCH_RESEARCH_OUTPUT = gql(`#graphql
  query FetchResearchOutput($id: String!, $withTeams: Boolean!) {
    findResearchOutputsContent(id: $id) {
      ...ResearchOutputContent
    }
  }
`);

export const FETCH_RESEARCH_OUTPUTS = gql(`#graphql
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
}`);
