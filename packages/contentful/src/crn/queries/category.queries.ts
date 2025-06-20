/* istanbul ignore file */
import { gql } from 'graphql-tag';

export const FETCH_CATEGORIES = gql`
  query FetchCategories($limit: Int, $skip: Int, $where: CategoryFilter) {
    categoryCollection(
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
