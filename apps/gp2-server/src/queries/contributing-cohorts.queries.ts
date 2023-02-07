import { gql } from 'graphql-tag';

export const contributingCohortsContentQueryFragment = gql`
  fragment ContributingCohortsContent on ContributingCohorts {
    id
    flatData {
      name
    }
  }
`;

export const FETCH_CONTRIBUTING_COHORTS = gql`
  query FetchContributingCohorts($top: Int, $skip: Int) {
    queryContributingCohortsContentsWithTotal(
      top: $top
      skip: $skip
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...ContributingCohortsContent
      }
    }
  }
  ${contributingCohortsContentQueryFragment}
`;
