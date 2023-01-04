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
      degree
      email
      firstName
      lastName
      region
      role
      country
      city
      positions {
        role
        department
        institution
      }
      questions {
        question
      }
      onboarded
      secondaryEmail
      telephoneCountryCode
      telephoneNumber
      keywords
      fundingStreams
      biography
      social {
        googleScholar
        orcid
        blog
        twitter
        linkedIn
        github
      }
    }
    referencingProjectsContents {
      id
      flatData {
        members {
          role
          user {
            id
          }
        }
        status
        title
      }
    }
    referencingWorkingGroupsContents {
      id
      flatData {
        members {
          role
          user {
            id
          }
        }
        title
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

export const projectMembersContentQueryFragment = gql`
  fragment ProjectMembersContent on Projects {
    flatData {
      members {
        user {
          id
        }
      }
    }
  }
`;

export const FETCH_PROJECTS_MEMBERS = gql`
  query FetchProjectsMembers($filter: String) {
    queryProjectsContents(filter: $filter) {
      ...ProjectMembersContent
    }
  }
  ${projectMembersContentQueryFragment}
`;

export const workingGroupMembersContentQueryFragment = gql`
  fragment WorkingGroupMembersContent on WorkingGroups {
    flatData {
      members {
        user {
          id
        }
      }
    }
  }
`;

export const FETCH_WORKINGGROUPS_MEMBERS = gql`
  query FetchWorkingGroupsMembers($filter: String) {
    queryWorkingGroupsContents(filter: $filter) {
      ...WorkingGroupMembersContent
    }
  }
  ${workingGroupMembersContentQueryFragment}
`;
