/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const resourceTypesContentQueryFragment = gql`
  fragment ResourceTypesContent on ResourceType {
    sys {
      id
    }
    name
  }
`;

export const FETCH_RESOURCE_TYPES = gql`
  ${resourceTypesContentQueryFragment}
  query FetchResourceTypes(
    $limit: Int
    $skip: Int
    $order: [ResourceTypeOrder]
  ) {
    resourceTypeCollection(limit: $limit, skip: $skip, order: $order) {
      total
      items {
        ...ResourceTypesContent
      }
    }
  }
`;
