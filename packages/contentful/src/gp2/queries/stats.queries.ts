import gql from 'graphql-tag';

export const statsContentQueryFragment = gql`
  fragment LatestStatsContentData on LatestStats {
    sampleCount
    articleCount
    cohortCount
  }
`;

export const FETCH_STATS = gql`
  query FetchLatestStats {
    latestStatsCollection(limit: 1) {
      total
      items {
        ...LatestStatsContentData
      }
    }
  }
  ${statsContentQueryFragment}
`;
