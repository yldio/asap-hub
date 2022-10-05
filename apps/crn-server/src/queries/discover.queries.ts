import gql from 'graphql-tag';
import { newsQueryFragment } from './news.queries';

export const FETCH_DISCOVER = gql`
  query FetchDiscover {
    queryDiscoverContents {
      flatData {
        aboutUs
        training {
          id
          created
          flatData {
            title
            shortText
            text
            thumbnail {
              id
            }
            link
            linkText
          }
        }
        workingGroups {
          ...News
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
  ${newsQueryFragment}
`;
