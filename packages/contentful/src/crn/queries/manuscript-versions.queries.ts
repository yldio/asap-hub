import { gql } from 'graphql-tag';

export const FETCH_MANUSCRIPT_VERSION_BY_ID = gql`
  query FetchManuscriptVersionById($id: String!) {
    manuscriptVersions(id: $id) {
      linkedFrom {
        manuscriptsCollection(limit: 1) {
          items {
            sys {
              id
            }
            title
            count
            teamsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                teamId
                grantId
              }
            }
            versionsCollection(order: count_DESC) {
              items {
                sys {
                  id
                }
                type
                lifecycle
                count
              }
            }
          }
        }
      }
    }
  }
`;

export const FETCH_VERSIONS_BY_MANUSCRIPT = gql`
  query FetchVersionsByManuscript(
    $limit: Int
    $skip: Int
    $where: ManuscriptsFilter
  ) {
    manuscriptsCollection(limit: $limit, skip: $skip, where: $where) {
      total
      items {
        sys {
          id
        }
        title
        count
        teamsCollection(limit: 1) {
          items {
            sys {
              id
            }
            teamId
            grantId
          }
        }
        versionsCollection(order: count_DESC) {
          items {
            sys {
              id
            }
            type
            lifecycle
            count
          }
        }
      }
    }
  }
`;
