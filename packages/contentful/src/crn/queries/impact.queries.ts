/* istanbul ignore file */
import { gql } from 'graphql-tag';

export const FETCH_IMPACTS = gql`
  query FetchImpacts($limit: Int, $skip: Int, $where: ImpactFilter) {
    impactCollection(
      limit: $limit
      skip: $skip
      where: $where
      order: name_ASC
    ) {
      total
      items {
        sys {
          id
        }
        name
      }
    }
  }
`;
