import React from 'react';
import { useParams } from 'react-router-dom';
import { ResearchOutputPage, Paragraph } from '@asap-hub/react-components';
import { useResearchOutputById } from '../api';

const ResearchOutput: React.FC = () => {
  const { id } = useParams();
  const { loading, data: researchOutputData, error } = useResearchOutputById(
    id,
  );

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
    };
    return (
      <ResearchOutputPage {...researchOutput} onClickBack={() => undefined} />
    );
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};
export default ResearchOutput;
