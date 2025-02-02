import { gql } from 'graphql-tag';

export const pagesContentQueryFragment = gql`
  fragment PageContent on Pages {
    sys {
      id
    }
    title
    path
    shortText
    text {
      json
      links {
        entries {
          inline {
            sys {
              id
            }
            __typename
            ... on Media {
              url
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
            contentType
            width
            height
          }
        }
      }
    }
    link
    linkText
  }
`;

export const FETCH_PAGES = gql`
  query FetchPages($where: PagesFilter) {
    pagesCollection(limit: 100, where: $where) {
      total
      items {
        ...PageContent
      }
    }
  }
  ${pagesContentQueryFragment}
`;
