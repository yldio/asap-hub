import { gql } from 'graphql-tag';

export const FETCH_USER_TEAMS_AND_RESEARCH_OUTPUTS = gql`
  query FetchUserTeamsAndResearchOutputs($userId: String!, $filter: String!) {
    findUsersContent(id: $userId) {
      flatData {
        teams {
          id {
            id
          }
        }
      }
    }

    queryResearchOutputsContents(filter: $filter) {
      id
      flatData {
        addedDate
        documentType
        title
      }
      referencingTeamsContents {
        id
      }
    }
  }
`;
