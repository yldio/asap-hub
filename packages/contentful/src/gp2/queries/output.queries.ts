/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const outputsContentQueryFragment = gql`
  fragment OutputsContentData on Outputs {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    title
    documentType
    type
    subtype
    link
    addedDate
    publishDate
    lastUpdatedPartial
    relatedEntity {
      __typename
      ... on Projects {
        sys {
          id
        }
        title
      }
      ... on WorkingGroups {
        sys {
          id
        }
        title
      }
    }
    authorsCollection(limit: 10) {
      total
      items {
        __typename
        ... on Users {
          sys {
            id
          }
          firstName
          lastName
          email
          avatar {
            url
          }
          onboarded
        }
        ... on ExternalUsers {
          sys {
            id
          }
          name
        }
      }
    }
  }
`;

export const FETCH_OUTPUT_BY_ID = gql`
  query FetchOutputById($id: String!) {
    outputs(id: $id) {
      ...OutputsContentData
    }
  }
  ${outputsContentQueryFragment}
`;

export const FETCH_OUTPUTS = gql`
  query FetchOutputs(
    $limit: Int
    $skip: Int
    $order: [OutputsOrder]
    $where: OutputsFilter
    $preview: Boolean
  ) {
    outputsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
      preview: $preview
    ) {
      total
      items {
        ...OutputsContentData
      }
    }
  }
  ${outputsContentQueryFragment}
`;
export const FETCH_OUTPUTS_BY_WORKING_GROUP_ID = gql`
  query FetchOutputsByWorkingGroupId($id: String!, $limit: Int, $skip: Int) {
    workingGroups(id: $id) {
      sys {
        id
      }
      linkedFrom {
        outputsCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...OutputsContentData
          }
        }
      }
    }
  }
  ${outputsContentQueryFragment}
`;

export const FETCH_OUTPUTS_BY_USER_ID = gql`
  query FetchOutputsByUserId($id: String!, $limit: Int, $skip: Int) {
    users(id: $id) {
      sys {
        id
      }
      linkedFrom {
        outputsCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...OutputsContentData
          }
        }
      }
    }
  }
  ${outputsContentQueryFragment}
`;

export const FETCH_OUTPUTS_BY_PROJECT_ID = gql`
  query FetchOutputsByProjectId($id: String!, $limit: Int, $skip: Int) {
    projects(id: $id) {
      sys {
        id
      }
      linkedFrom {
        outputsCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...OutputsContentData
          }
        }
      }
    }
  }
  ${outputsContentQueryFragment}
`;
