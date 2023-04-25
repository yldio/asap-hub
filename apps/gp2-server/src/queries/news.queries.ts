import gql from 'graphql-tag';

export const newsContentQueryFragment = gql`
  fragment NewsData on NewsAndEvents {
    id
    created
    lastModified
    version
    flatData {
      title
      shortText
      link
      linkText
      sampleCount
      articleCount
      cohortCount
      link
      linkText
    }
  }
`;

export const FETCH_NEWS = gql`
  query FetchNews($top: Int, $skip: Int) {
    queryNewsAndEventsContentsWithTotal(
      top: $top
      skip: $skip
      orderby: "created desc"
    ) {
      total
      items {
        ...NewsData
      }
    }
  }
  ${newsContentQueryFragment}
`;
