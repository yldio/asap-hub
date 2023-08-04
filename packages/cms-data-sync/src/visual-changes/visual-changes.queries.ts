/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchOutputIdsQuery = gql`
  query FetchResearchOutputIds($take: Int, $skip: Int) {
    queryResearchOutputsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
      }
    }
  }
`;
