/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchOutputIdsQuery = gql`
  query FetchResearchOutputIds {
    queryResearchOutputsContentsWithTotal {
      total
      items {
        id
      }
    }
  }
`;
