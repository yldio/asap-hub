import gql from 'graphql-tag';
import { tutorialsContentQueryFragment } from './tutorials.queries';
import { workingGroupsContentQueryFragment } from './working-groups.queries';

export const FETCH_DISCOVER = gql`
  query FetchDiscover {
    queryDiscoverContents {
      flatData {
        aboutUs
        training {
          ...TutorialsContent
        }
        workingGroups {
          ...WorkingGroupsContent
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
  ${workingGroupsContentQueryFragment}
  ${tutorialsContentQueryFragment}
`;
