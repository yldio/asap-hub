import { article, RecentSharedOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { EventResponse } from '@asap-hub/model';

export default {
  title: 'Organisms / Recent Shared Outputs',
};

export const Normal = () => (
  <RecentSharedOutputs<EventResponse['relatedResearch']>
    getIconForDocumentType={() => article}
    outputs={createListResearchOutputResponse(5).items}
  />
);
