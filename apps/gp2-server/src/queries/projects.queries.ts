import { gql } from 'graphql-tag';

export const projectContentQueryFragment = gql`
  fragment ProjectContent on Projects {
    id
    flatData {
      title
      startDate
      endDate
      status
      projectProposal
      description
      pmEmail
      leadEmail
      keywords
      members {
        user {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            firstName
            lastName
          }
        }
      }
      milestones {
        title
        description
        status
        link
      }
    }
  }
`;

export const FETCH_PROJECT = gql`
  query FetchProject($id: String!) {
    findProjectsContent(id: $id) {
      ...ProjectContent
    }
  }
  ${projectContentQueryFragment}
`;

export const FETCH_PROJECTS = gql`
  query FetchProjects {
    queryProjectsContentsWithTotal(orderby: "created desc") {
      total
      items {
        ...ProjectContent
      }
    }
  }
  ${projectContentQueryFragment}
`;
