import { gql } from 'graphql-tag';

export const FETCH_PAGES = gql`
  query FetchPages($where: PagesFilter) {
    pagesCollection(limit: 100, where: $where) {
      total
      items {
        sys {
          id
        }
        title
        path
        shortText
        text {
          json
        }
        link
        linkText
      }
    }
  }
`;
