/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { workingGroupsContentQueryFragment } from './working-group.queries';

export const workingGroupNetworkContentQueryFragment = gql`
  fragment WorkingGroupNetworkContentData on WorkingGroupNetwork {
    supportCollection(limit: 20) {
      total
      total
      items {
        ...WorkingGroupsContentData
      }
    }
    monogenicCollection(limit: 20) {
      total
      items {
        ...WorkingGroupsContentData
      }
    }
    operationalCollection(limit: 20) {
      total
      items {
        ...WorkingGroupsContentData
      }
    }
    complexDiseaseCollection(limit: 20) {
      total
      items {
        ...WorkingGroupsContentData
      }
    }
  }
  ${workingGroupsContentQueryFragment}
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
