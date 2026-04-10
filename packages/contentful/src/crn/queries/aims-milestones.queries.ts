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

export const FETCH_MILESTONE_ARTICLES = gql`
  query FetchMilestoneArticles($id: String!) {
    milestones(id: $id) {
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
`;

export const FETCH_AIMS_LINKED_TO_MILESTONE = gql`
  query FetchAimsLinkedToMilestone($milestoneId: String!) {
    milestones(id: $milestoneId) {
      linkedFrom {
        aimsCollection(limit: 50) {
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

export const FETCH_PROJECT_WITH_AIMS_DETAIL_BY_AIM_ID = gql`
  query FetchProjectWithAimsDetailByAimId($aimId: String!) {
    aims(id: $aimId) {
      linkedFrom {
        projectsCollection(limit: 1) {
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
        supplementGrantCollection(limit: 1) {
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
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
          }
        }
      }
    }
  }
`;

export const FETCH_AIM_WITH_MILESTONES_BY_ID = gql`
  query FetchAimWithMilestonesById($aimId: String!) {
    aims(id: $aimId) {
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
`;

export const FETCH_MILESTONE_BY_ID = gql`
  query FetchMilestoneById($milestoneId: String!) {
    milestones(id: $milestoneId) {
      sys {
        id
        firstPublishedAt
        publishedAt
      }
      description
      status
      relatedArticlesCollection(limit: 50) {
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
`;

export const FETCH_PROJECT_WITH_AIMS_DETAIL_BY_ID = gql`
  query FetchProjectWithAimsDetailById($projectId: String!) {
    projects(id: $projectId) {
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
`;

export const FETCH_PROJECT_ID_BY_MEMBERSHIP_ID = gql`
  query FetchProjectIdByMembershipId($membershipId: String!) {
    projectMembership(id: $membershipId) {
      linkedFrom {
        projectsCollection(limit: 1) {
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
        relatedArticlesCollection(limit: 50) {
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
