/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const workingGroupNetworkContentQueryFragment = gql`
  fragment WorkingGroupNetworkContentData on WorkingGroupNetwork {
    supportCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        title
        shortDescription
        leadingMembers
        membersCollection {
          total
          items {
            sys {
              id
            }
          }
        }
      }
    }
    monogenicCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        title
        shortDescription
        leadingMembers
        membersCollection {
          total
          items {
            sys {
              id
            }
          }
        }
      }
    }
    operationalCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        title
        shortDescription
        leadingMembers
        membersCollection {
          total
          items {
            sys {
              id
            }
          }
        }
      }
    }
    complexDiseaseCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        title
        shortDescription
        leadingMembers
        membersCollection {
          total
          items {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

export const FETCH_WORKING_GROUP_NETWORK = gql`
  query FetchWorkingGroupNetwork {
    workingGroupNetworkCollection(limit: 1) {
      total
      items {
        ...WorkingGroupNetworkContentData
      }
    }
  }
  ${workingGroupNetworkContentQueryFragment}
`;
