import { EventResponse } from '@asap-hub/model';
import {
  DashboardSection,
  RecentSharedOutputs,
  getIconForDocumentType,
} from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { FC } from 'react';

import { useResearchOutputs } from '../../shared-research/state';

const RecentSharedResearchSection: FC = () => {
  const recentSharedOutputs = useResearchOutputs({
    searchQuery: '',
    currentPage: 0,
    pageSize: 5,
  });

  return (
    <DashboardSection
      title="Recent Shared Research"
      description="Explore and learn more about the latest Shared Research."
      viewAllHref={
        recentSharedOutputs && recentSharedOutputs.total > 5
          ? sharedResearch({}).$
          : undefined
      }
      viewAllTestId="view-recent-shared-outputs"
    >
      <RecentSharedOutputs<EventResponse['relatedResearch']>
        getIconForDocumentType={getIconForDocumentType}
        outputs={recentSharedOutputs?.items}
      />
    </DashboardSection>
  );
};

export default RecentSharedResearchSection;
