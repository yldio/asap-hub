/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_PROJECTS_WITH_AIMS = gql`
  query FetchProjectsWithAims($limit: Int!, $skip: Int!) {
    projectsCollection(limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        title
        originalGrantAimsCollection(limit: 50) {
          items {
            sys {
              id
            }
            description
          }
        }
        supplementGrant {
          aimsCollection(limit: 50) {
            items {
              sys {
                id
              }
              description
            }
          }
        }
      }
    }
  }
`;

export const FETCH_AIMS_WITH_MILESTONES = gql`
  query FetchAimsWithMilestones($limit: Int!, $skip: Int!) {
    aimsCollection(limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        milestonesCollection(limit: 50) {
          items {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

export const FETCH_PROJECTS_WITH_AIMS_DETAIL = gql`
  query FetchProjectsWithAimsDetail($limit: Int!, $skip: Int!) {
    projectsCollection(limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        title
        status
        membersCollection(limit: 50) {
          items {
            projectMember {
              __typename
              ... on Teams {
                sys {
                  id
                }
                displayName
              }
            }
          }
        }
        originalGrantAimsCollection(limit: 50) {
          items {
            sys {
              id
              firstPublishedAt
              publishedAt
            }
            description
          }
        }
        supplementGrant {
          aimsCollection(limit: 50) {
            items {
              sys {
                id
                firstPublishedAt
                publishedAt
              }
              description
            }
          }
        }
      }
    }
  }
`;

export const FETCH_AIM_ARTICLES = gql`
  query FetchAimArticles($id: String!) {
    aims(id: $id) {
      milestonesCollection(limit: 50) {
        items {
          relatedArticlesCollection(limit: 50) {
            items {
              sys {
                id
              }
              title
            }
          }
        }
      }
    }
  }
`;

export const FETCH_MILESTONES = gql`
  query FetchMilestones($limit: Int!, $skip: Int!) {
    milestonesCollection(limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        description
        status
        relatedArticlesCollection(limit: 100) {
          total
          items {
            sys {
              id
            }
            doi
          }
        }
      }
    }
  }
`;
