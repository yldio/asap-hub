import gql from 'graphql-tag';
import { tutorialsContentQueryFragment } from './tutorials.queries';

export const FETCH_DISCOVER = gql`
  query FetchDiscover {
    queryDiscoverContents {
      flatData {
        aboutUs
        training {
          ...TutorialsContent
        }
        pages {
          id
          created
          lastModified
          version
          flatData {
            shortText
            text
            title
            link
            linkText
          }
        }
        members {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            email
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
          }
        }
        membersTeam {
          id
        }
        scientificAdvisoryBoard {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            email
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
          }
        }
      }
    }
  }
  ${tutorialsContentQueryFragment}
`;
