import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ResearchOutputPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';

import { useBackHref } from '../hooks';
import { useResearchOutputById } from '../api';
import { NETWORK_PATH, SHARED_RESEARCH_PATH } from '../routes';
import { TEAMS_PATH } from '../network/routes';

const ResearchOutput: React.FC = () => {
  const { id } = useParams();
  const { loading, data: researchOutputData } = useResearchOutputById(id);
  const backHref = useBackHref() ?? SHARED_RESEARCH_PATH;

  if (loading) {
    return <Loading />;
  }

  if (researchOutputData) {
    const researchOutput = {
      ...researchOutputData,
      team: researchOutputData.team
        ? {
            ...researchOutputData.team,
            href: `${NETWORK_PATH}/${TEAMS_PATH}/${researchOutputData.team.id}`,
          }
        : undefined,
      backHref,
    };
    return <ResearchOutputPage {...researchOutput} />;
  }

  return <NotFoundPage />;
};
export default ResearchOutput;
