import gql from 'graphql-tag';

export const discoverQuery = gql`
  query FetchDiscover {
    queryDiscoverContents {
      id
      flatData {
        aboutUs
        training {
          id
        }
        pages {
          id
        }
        members {
          id
        }
        membersTeam {
          id
        }
        scientificAdvisoryBoard {
          id
        }
      }
    }
  }
`;
