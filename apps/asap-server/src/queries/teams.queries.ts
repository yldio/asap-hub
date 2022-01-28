import gql from 'graphql-tag';

export const teamsContentQueryFragment = gql`
  fragment TeamsContent on Teams {
    id
    created
    lastModified
    version
    flatData {
      applicationNumber
      displayName
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
      outputs {
        id
      }
    }
    referencingUsersContents(filter: "data/onboarded/iv eq true") {
      id
      created
      lastModified
      version
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
        researchInterests
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
`;

export const FETCH_TEAM = gql`
  query FetchTeam($id: String!) {
    findTeamsContent(id: $id) {
      ...TeamsContent
    }
  }
  ${teamsContentQueryFragment}
`;

export const FETCH_TEAMS = gql`
  query FetchTeams($top: Int, $skip: Int, $filter: String) {
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
