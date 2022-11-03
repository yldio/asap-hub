import { gql } from 'graphql-tag';

export const FETCH_NEWS = gql`
  query FetchNews(
    $limit: Int
    $skip: Int
    $frequency: [String]
    $title: String
  ) {
    newsCollection(
      limit: $limit
      skip: $skip
      where: { frequency_in: $frequency, title_contains: $title }
      order: sys_firstPublishedAt_DESC
    ) {
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
  }
`;
