import gql from 'graphql-tag';

export const labContentQueryFragment = gql`
  fragment LabsContent on Labs {
    id
    flatData {
      name
    }
  }
`;

export const FETCH_LABS = gql`
  query FetchLabs($top: Int, $skip: Int, $filter: String) {
    queryLabsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...LabsContent
      }
    }
  }
  ${labContentQueryFragment}
`;
