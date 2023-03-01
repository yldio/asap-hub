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
      subtype
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
            onboarded
            email
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
      workingGroups {
        id
        flatData {
          title
        }
      }
      projects {
        id
        flatData {
          title
        }
      }
    }
  }
`;

export const FETCH_OUTPUT = gql`
  query FetchOutput($id: String!) {
    findOutputsContent(id: $id) {
      ...OutputContent
    }
  }
  ${outputContentQueryFragment}
`;

export const FETCH_OUTPUTS = gql`
  query FetchOutputs($top: Int, $skip: Int, $filter: String) {
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
