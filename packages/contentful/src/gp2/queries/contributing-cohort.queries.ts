/* istanbul ignore file */
import { gql } from 'graphql-tag';

export const contributingCohortsContentQueryFragment = gql`
  fragment ContributingCohortsContentData on ContributingCohorts {
    sys {
      id
    }
    name
  }
`;

export const FETCH_CONTRIBUTING_COHORTS = gql`
  query FetchContributingCohorts(
    $limit: Int
    $skip: Int
    $order: [ContributingCohortsOrder]
  ) {
    contributingCohortsCollection(limit: $limit, skip: $skip, order: $order) {
      total
      items {
        ...ContributingCohortsContentData
      }
    }
  }
  ${contributingCohortsContentQueryFragment}
`;
