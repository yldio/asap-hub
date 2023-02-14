import { gql } from 'graphql-tag';

export const newsContentQueryFragment = gql`
  fragment NewsContent on News {
    sys {
      id
      firstPublishedAt
    }
    title
    shortText
    frequency
    link
    linkText
    thumbnail {
      url
    }
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
    publishDate
  }
`;

export const FETCH_NEWS_BY_ID = gql`
  query FetchNewsById($id: String!) {
    news(id: $id) {
      ...NewsContent
    }
  }
  ${newsContentQueryFragment}
`;

export const FETCH_NEWS = gql`
  query FetchNews(
    $limit: Int
    $skip: Int
    $order: [NewsOrder]
    $where: NewsFilter
  ) {
    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        ...NewsContent
      }
    }
  }
  ${newsContentQueryFragment}
`;
