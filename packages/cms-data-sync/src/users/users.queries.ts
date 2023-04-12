import { gql } from 'graphql-tag';

export const usersQuery = gql`
  query FetchUsers($take: Int, $skip: Int) {
    queryUsersContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        created
        lastModified
        version
        flatData {
          alumniSinceDate
          alumniLocation
          avatar {
            id
            fileName
            mimeType
            fileType
          }
          biography
          connections {
            code
          }
          degree
          email
          contactEmail
          dismissedGettingStarted
          firstName
          institution
          jobTitle
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
                inactiveSince
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
    }
  }
`;
