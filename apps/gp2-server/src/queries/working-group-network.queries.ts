import { gql } from 'graphql-tag';
import { workingGroupContentQueryFragment } from './working-groups.queries';

export const workingGroupNetworkQueryFragment = gql`
  fragment WorkingGroupNetworkData on WorkingGroupNetwork {
    id
    flatData {
      support {
        ...WorkingGroupData
      }
      complexDisease {
        ...WorkingGroupData
      }
      monogenic {
        ...WorkingGroupData
      }
      operational {
        ...WorkingGroupData
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;

export const FETCH_WORKING_GROUP_NETWORK = gql`
  query FetchWorkingGroupNetwork {
    queryWorkingGroupNetworkContents {
      ...WorkingGroupNetworkData
    }
  }
  ${workingGroupNetworkQueryFragment}
`;
