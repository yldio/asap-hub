import gql from 'graphql-tag';

export const outputContentQueryFragment = gql`
  fragment OutputContent on Outputs {
    id
    created
    lastModified
    version
    flatData {
      title
      documentType
      type
      link
      addedDate
      publishDate
      lastUpdatedPartial
      authors {
        __typename
        ... on Users {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            firstName
            lastName
          }
        }
        ... on ExternalAuthors {
          id
          created
          lastModified
          version
          flatData {
            name
            orcid
          }
        }
      }
    }
  }
`;

export const FETCH_RESEARCH_OUTPUT = gql`
  query FetchOutput($id: String!, $withTeams: Boolean!) {
    findOutputsContent(id: $id) {
      ...OutputContent
    }
  }
  ${outputContentQueryFragment}
`;

export const FETCH_OUTPUTS = gql`
  query FetchOutputs(
    $top: Int
    $skip: Int
    $filter: String
    $withTeams: Boolean!
  ) {
    queryOutputsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "created desc"
    ) {
      total
      items {
        ...OutputContent
      }
    }
  }
  ${outputContentQueryFragment}
`;
