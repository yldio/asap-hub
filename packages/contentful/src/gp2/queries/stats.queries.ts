import gql from 'graphql-tag';

export const FETCH_STATS = gql`
  query FetchPages() {
    latestStatsCollection(limit: 1) {
      items {
        sampleCount
        cohortCount
        articleCount
      }
    }
  }
`;
