import { TeamMetricsPage } from '@asap-hub/react-components';
import { FC } from 'react';

import { useTeamHubResearchOutputs } from '../../analytics/productivity/state';
import { getHubResearchOutputRows } from './getHubResearchOutputRows';

type TeamMetricsProps = {
  teamId: string;
};

const TeamMetrics: FC<TeamMetricsProps> = ({ teamId }) => {
  const { all, public: publicOutputs } = useTeamHubResearchOutputs({ teamId });
  const hubResearchOutputRows = getHubResearchOutputRows(all, publicOutputs);
  return <TeamMetricsPage hubResearchOutputRows={hubResearchOutputRows} />;
};

export default TeamMetrics;
