import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContent on Users {
    id
    created
    lastModified
    version
    referencingWorkingGroupsContents {
      id
      flatData {
        title
        complete
        leaders {
          inactiveSinceDate
          role
          user {
            id
          }
        }
        members {
          inactiveSinceDate
          user {
            id
          }
        }
      }
    }
    flatData {
      alumniSinceDate
      alumniLocation
      avatar {
        id
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
`;

export const FETCH_USER = gql`
  query FetchUser($id: String!) {
    findUsersContent(id: $id) {
      ...UsersContent
    }
  }
  ${usersContentQueryFragment}
`;

export const FETCH_USERS = gql`
  query FetchUsers($top: Int, $skip: Int, $filter: String, $orderBy: String) {
    queryUsersContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: $orderBy
    ) {
      total
      items {
        ...UsersContent
      }
    }
  }
  ${usersContentQueryFragment}
`;
