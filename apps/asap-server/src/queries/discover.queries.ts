import gql from 'graphql-tag';

export const FETCH_DISCOVER = gql`
  query FetchDiscover {
    queryDiscoverContents {
      flatData {
        aboutUs
        training {
          id
          created
          flatData {
            type
            shortText
            text
            title
            link
            linkText
            thumbnail {
              id
            }
          }
        }
        pages {
          id
          created
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
`;
