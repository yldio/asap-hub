/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const projectsContentQueryFragment = gql`
  fragment ProjectsContentData on Projects {
    sys {
      id
      firstPublishedAt
      publishedAt
    }
    title
    projectId
    grantId
    originalGrant
    projectType
    status
    startDate
    endDate
    applicationNumber
    contactEmail
    googleDriveLink
    proposal {
      sys {
        id
      }
    }
    supplementGrant {
      sys {
        id
      }
      title
      description
      startDate
      endDate
      proposal {
        sys {
          id
        }
      }
    }
    resourceType {
      sys {
        id
      }
      name
    }
    researchTagsCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        name
        category
        types
      }
    }
    milestonesCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        title
        description
        status
        externalLink
      }
    }
    membersCollection(limit: 100) {
      total
      items {
        sys {
          id
        }
        role
        projectMember {
          ... on Users {
            __typename
            sys {
              id
            }
            firstName
            nickname
            lastName
            email
            onboarded
            alumniSinceDate
            avatar {
              url
            }
          }
          ... on Teams {
            __typename
            sys {
              id
            }
            displayName
            inactiveSince
            researchTheme {
              name
            }
            teamDescription
          }
        }
      }
    }
  }
`;

export const FETCH_PROJECTS = gql`
  ${projectsContentQueryFragment}
  query FetchProjects(
    $limit: Int
    $skip: Int
    $order: [ProjectsOrder]
    $where: ProjectsFilter
  ) {
    projectsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...ProjectsContentData
      }
    }
  }
`;

export const FETCH_PROJECT_BY_ID = gql`
  ${projectsContentQueryFragment}
  query FetchProjectById($id: String!) {
    projects(id: $id) {
      ...ProjectsContentData
    }
  }
`;
