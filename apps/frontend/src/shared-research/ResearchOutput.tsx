import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ResearchOutputPage,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useResearchOutputById } from '../api';
import { NETWORK_PATH } from '../routes';
import { TEAMS_PATH } from '../network/routes';

const ResearchOutput: React.FC = () => {
  const { id } = useParams();
  const { loading, data: researchOutputData } = useResearchOutputById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
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
      profileHref: '#',
      sharedResearchHref: '/shared-research',
    };
    return <ResearchOutputPage {...researchOutput} />;
  }

  return <NotFoundPage />;
};
export default ResearchOutput;
