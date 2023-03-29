import { gql } from 'graphql-tag';

export const teamsQuery = gql`
  query FetchTeams {
    queryTeamsContents(top: 100) {
      id
      created
      lastModified
      version
      flatData {
        applicationNumber
        displayName
        inactiveSince
        projectSummary
        projectTitle
        expertiseAndResourceTags
        tools {
          description
          name
          url
        }
      }
    }
  }
`;
