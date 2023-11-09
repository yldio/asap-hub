/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const relatedOutputQueryFragment = gql`
  fragment RelatedOutputData on Outputs {
    sys {
      id
    }
    title
    documentType
    type
    relatedEntitiesCollection(limit: 1) {
      items {
        __typename
        ... on WorkingGroups {
          sys {
            id
          }
          title
        }
        ... on Projects {
          sys {
            id
          }
          title
        }
      }
    }
  }
`;

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
    description
    gp2Supported
    sharingStatus
    link
    addedDate
    publishDate
    lastUpdatedPartial
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
    tagsCollection(limit: 10) {
      total
      items {
        sys {
          id
        }
        name
      }
    }
    relatedOutputsCollection(limit: 10) {
      items {
        ...RelatedOutputData
      }
    }
    linkedFrom {
      outputsCollection(limit: 50, order: [addedDate_ASC]) {
        items {
          ...RelatedOutputData
        }
      }
    }
    relatedEventsCollection(limit: 10) {
      total
      items {
        sys {
          id
        }
        title
        endDate
      }
    }
    doi
    rrid
    accessionNumber
    relatedEntitiesCollection {
      total
      items {
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
    }
    contributingCohortsCollection(limit: 10) {
      total
      items {
        sys {
          id
        }
        name
        studyLink
      }
    }
    versionsCollection {
      total
      items {
        sys {
          id
        }
        title
        documentType
        type
        addedDate
        link
      }
    }
  }
  ${relatedOutputQueryFragment}
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

export const FETCH_OUTPUTS_BY_EXTERNAL_USER_ID = gql`
  query FetchOutputsByExternalUserId($id: String!, $limit: Int, $skip: Int) {
    externalUsers(id: $id) {
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

export const FETCH_OUTPUTS_BY_EVENT_ID = gql`
  query FetchOutputsByEventId($id: String!, $limit: Int, $skip: Int) {
    events(id: $id) {
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

export const FETCH_OUTPUTS_BY_RELATED_OUTPUT_ID = gql`
  query FetchOutputsByRelatedOutputId(
    $id: String!
    $limit: Int
    $skip: Int
    $preview: Boolean
  ) {
    outputs(id: $id, preview: $preview) {
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
