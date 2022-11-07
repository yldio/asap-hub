import { gql } from 'graphql-tag';

export const newsContentQueryFragment = gql`
  fragment NewsContent on NewsCollection {
    items {
      sys {
        firstPublishedAt
      }
      id
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
      }
    }
  }
`;

export const FETCH_NEWS_BY_ID = gql`
  query FetchNewsById($id: String!) {
    newsCollection(where: { id: $id }) {
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
      ...NewsContent
    }
  }
  ${newsContentQueryFragment}
`;
