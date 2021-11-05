import gql from 'graphql-tag';
import { researchOutputContentQueryFragment } from './research-outputs.queries';

export const teamsContentQueryFragment = gql`
  fragment TeamsContent on Teams {
    id
    created
    lastModified
    flatData {
      applicationNumber
      displayName
      outputs @include(if: $withResearchOutputs) {
        ...ResearchOutputContent
      }
      projectSummary
      projectTitle
      expertiseAndResourceTags
      proposal {
        id
      }
      tools {
        description
        name
        url
      }
    }
    referencingUsersContents(filter: "data/onboarded/iv eq true") {
      id
      created
      lastModified
      flatData {
        avatar {
          id
        }
        biography
        degree
        email
        contactEmail
        firstName
        institution
        jobTitle
        lastModifiedDate
        lastName
        country
        city
        onboarded
        orcid
        orcidLastModifiedDate
        orcidLastSyncDate
        orcidWorks {
          doi
          id
          lastModifiedDate
          publicationDate
          title
          type
        }
        questions {
          question
        }
        expertiseAndResourceTags
        expertiseAndResourceDescription
        teams {
          role
          mainResearchInterests
          responsibilities
          id {
            id
            flatData {
              displayName
              proposal {
                id
              }
            }
          }
        }
        social {
          github
          googleScholar
          linkedIn
          researcherId
          researchGate
          twitter
          website1
          website2
        }
        role
        responsibilities
        reachOut
        labs {
          id
          flatData {
            name
          }
        }
      }
    }
  }
  ${researchOutputContentQueryFragment}
`;

export const FETCH_TEAM = gql`
  query FetchTeam(
    $id: String!
    $withResearchOutputs: Boolean = false
    $withTeams: Boolean = false
  ) {
    findTeamsContent(id: $id) {
      ...TeamsContent
    }
  }
  ${teamsContentQueryFragment}
`;

export const FETCH_TEAMS = gql`
  query FetchTeams(
    $top: Int
    $skip: Int
    $filter: String
    $withResearchOutputs: Boolean = true
    $withTeams: Boolean = false
  ) {
    queryTeamsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/displayName/iv"
    ) {
      total
      items {
        ...TeamsContent
      }
    }
  }
  ${teamsContentQueryFragment}
`;
