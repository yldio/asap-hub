/* istanbul ignore file */
import { gql } from 'graphql-tag';

export const FETCH_LABS = gql`
  query FetchLabs($limit: Int, $skip: Int, $where: LabsFilter) {
    labsCollection(limit: $limit, skip: $skip, where: $where, order: name_ASC) {
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
