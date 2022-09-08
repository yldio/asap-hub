import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContent on Users {
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
      dismissedGettingStarted
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
  query FetchUsers($top: Int, $skip: Int, $filter: String) {
    queryUsersContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/firstName/iv,data/lastName/iv"
    ) {
      total
      items {
        ...UsersContent
      }
    }
  }
  ${usersContentQueryFragment}
`;
