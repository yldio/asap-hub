/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const projectsContentQueryFragment = gql`
  fragment ProjectsContentData on Projects {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    title
    startDate
    endDate
    status
    projectProposal
    description
    pmEmail
    leadEmail
    tagsCollection(limit: 6) {
      total
      items {
        sys {
          id
        }
        name
      }
    }
    traineeProject
    opportunitiesAvailable
    opportunitiesShortText
    opportunitiesLinkName
    opportunitiesLink
    membersCollection(limit: 50) {
      total
      items {
        sys {
          id
        }
        role
        user {
          sys {
            id
          }
          firstName
          nickname
          lastName
          onboarded
          avatar {
            url
          }
        }
      }
    }
    milestonesCollection(limit: 10) {
      total
      items {
        sys {
          id
        }
        description
        externalLink
        status
        title
      }
    }
    resourcesCollection(limit: 10) {
      total
      items {
        sys {
          id
        }
        type
        title
        description
        externalLink
      }
    }
    calendar {
      sys {
        id
      }
      name
    }
  }
`;

export const FETCH_PROJECT_BY_ID = gql`
  query FetchProjectById($id: String!) {
    projects(id: $id) {
      ...ProjectsContentData
    }
  }
  ${projectsContentQueryFragment}
`;

export const FETCH_PROJECTS = gql`
  query FetchProjects($limit: Int, $skip: Int, $where: ProjectsFilter) {
    projectsCollection(limit: $limit, skip: $skip, where: $where) {
      total
      items {
        ...ProjectsContentData
      }
    }
  }
  ${projectsContentQueryFragment}
`;

export const FETCH_PROJECTS_BY_USER = gql`
  query FetchProjectsByUser($limit: Int, $skip: Int, $userId: String!) {
    projectMembershipCollection(
      limit: $limit
      skip: $skip
      where: { user: { sys: { id: $userId } } }
    ) {
      total
      items {
        linkedFrom {
          projectsCollection(limit: 1) {
            total
            items {
              ...ProjectsContentData
            }
          }
        }
      }
    }
  }
  ${projectsContentQueryFragment}
`;
