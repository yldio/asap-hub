import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ResearchOutputPage,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useResearchOutputById } from '../api';

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
            href: `/network/teams/${researchOutputData.team.id}`,
          }
        : undefined,
      profileHref: '#',
      libraryHref: '/library',
    };
    return <ResearchOutputPage {...researchOutput} />;
  }

  return <NotFoundPage />;
};
export default ResearchOutput;
