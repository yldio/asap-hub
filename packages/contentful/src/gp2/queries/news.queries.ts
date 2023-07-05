/* istanbul ignore file */
import { gql } from 'graphql-tag';

export const newsContentQueryFragment = gql`
  fragment NewsContentData on News {
    sys {
      id
      firstPublishedAt
    }
    title
    shortText
    link
    linkText
    publishDate
    type
  }
`;

export const FETCH_NEWS_BY_ID = gql`
  query FetchNewsById($id: String!) {
    news(id: $id) {
      ...NewsContentData
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
        ...NewsContentData
      }
    }
  }
  ${newsContentQueryFragment}
`;
