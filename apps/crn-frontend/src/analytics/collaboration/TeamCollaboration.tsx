import { TeamCollaborationResponse } from '@asap-hub/model';
import {
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamCollaboration,
  useTeamCollaborationPerformance,
} from './state';
import { CollaborationProps } from './UserCollaboration';

const getDataForType = (
  data: TeamCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): TeamCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isInactive: !!row.inactiveSince,
      ...row.outputsCoProducedWithin,
      collaborationByTeam: [],
      type: 'within-team',
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isInactive: !!row.inactiveSince,
    ...row.outputsCoProducedAcross.byDocumentType,
    collaborationByTeam: row.outputsCoProducedAcross.byTeam,
    type: 'across-teams',
  }));
};

const TeamCollaboration: React.FC<CollaborationProps> = ({ type, tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, outputType } = useAnalytics();

  const { items: data, total } = useAnalyticsTeamCollaboration({
    currentPage,
    outputType,
    pageSize,
    sort: '',
    tags,
    timeRange,
  });

  const performance = useTeamCollaborationPerformance({
    timeRange,
    outputType,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamCollaborationTable
      data={getDataForType(data, type)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      performance={
        type === 'within-team' ? performance.withinTeam : performance.acrossTeam
      }
    />
  );
};

export default TeamCollaboration;
