import { gql } from 'graphql-tag';
import { workingGroupContentQueryFragment } from './working-groups.queries';

export const workingGroupNetworkQueryFragment = gql`
  fragment WorkingGroupNetworkContent on WorkingGroupNetwork {
    id
    flatData {
      complexDisease {
        ...WorkingGroupContent
      }
      monogenic {
        ...WorkingGroupContent
      }
      operational {
        ...WorkingGroupContent
      }
      support {
        ...WorkingGroupContent
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;

export const FETCH_WORKING_GROUP_NETWORK = gql`
  query FetchWorkingGroupNetwork {
    queryWorkingGroupNetworkContents {
      ...WorkingGroupNetworkContent
    }
  }
  ${workingGroupNetworkQueryFragment}
`;
