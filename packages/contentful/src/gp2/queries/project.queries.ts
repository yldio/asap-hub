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
    keywords
    traineeProject
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
  query FetchProjects($limit: Int, $skip: Int) {
    projectsCollection(limit: $limit, skip: $skip) {
      total
      items {
        ...ProjectsContentData
      }
    }
  }
  ${projectsContentQueryFragment}
`;
