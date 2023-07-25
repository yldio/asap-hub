import { gql } from 'graphql-tag';

export const researchOutputsQuery = gql`
  query FetchResearchOutputs($take: Int, $skip: Int) {
    queryResearchOutputsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        created
        lastModified
        status
        flatData {
          title
          documentType
          type
          description
          descriptionMD
          addedDate
          lastUpdatedPartial
          link
          asapFunded
          sharingStatus
          usedInAPublication
          publishDate
          rrid
          accession
          doi
          labCatalogNumber
          adminNotes
          usageNotes
          authors {
            ... on Users {
              id
              status
            }
            ... on ExternalAuthors {
              id
              status
            }
          }
          relatedResearch {
            id
            status
          }
          relatedEvents {
            id
            status
          }
          labs {
            id
            status
          }
          workingGroups {
            id
            status
          }
          teams {
            id
            status
          }
          methods {
            id
            status
          }
          organisms {
            id
            status
          }
          environments {
            id
            status
          }
          subtype {
            id
            status
          }
          keywords {
            id
            status
          }
        }
      }
    }
  }
`;
