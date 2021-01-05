import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  ResearchOutputPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { useResearchOutputById } from '../api';
import { NETWORK_PATH } from '../routes';
import { TEAMS_PATH } from '../network/routes';

const ResearchOutput: React.FC = () => {
  const { id } = useParams();
  const { loading, data: researchOutputData } = useResearchOutputById(id);
  // TODO don't do this elsewhere, this is a not ideal, if you come straight to this page you'll go back to about:blank leaving the hub
  const { goBack } = useHistory();

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
      userProfileHref: '#',
      goBack,
    };
    return <ResearchOutputPage {...researchOutput} />;
  }

  return <NotFoundPage />;
};
export default ResearchOutput;
