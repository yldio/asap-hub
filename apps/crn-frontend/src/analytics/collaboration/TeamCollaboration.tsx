import { TeamCollaborationResponse } from '@asap-hub/model';
import {
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsTeamCollaboration } from './state';
import { CollaborationProps } from './UserCollaboration';

const getDataForType = (
  data: TeamCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): TeamCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isInactive: row.isInactive,
      ...row.outputsCoProducedWithin,
      collaborationByTeam: [],
      type: 'within-team',
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isInactive: row.isInactive,
    ...row.outputsCoProducedAcross.byDocumentType,
    collaborationByTeam: row.outputsCoProducedAcross.byTeam,
    type: 'across-teams',
  }));
};

const TeamCollaboration: React.FC<CollaborationProps> = ({ type }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const { items: data, total } = useAnalyticsTeamCollaboration({
    currentPage,
    pageSize,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamCollaborationTable
      data={getDataForType(data, type)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default TeamCollaboration;
