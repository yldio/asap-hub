import { RecentSharedOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Recent Shared Outputs',
};

export const Normal = () => (
  <RecentSharedOutputs outputs={createListResearchOutputResponse(5).items} />
);
