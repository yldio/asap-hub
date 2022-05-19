import React from 'react';
import { NotFoundPage } from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { useResearchOutputById } from './state';
import { useCanCreateUpdateResearchOutput } from '../network/teams/state';
import TeamOutput from '../network/teams/TeamOutput';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).editResearchOutput,
  );
  const researchOutputData = useResearchOutputById(researchOutputId);
  const canCreateUpdate = useCanCreateUpdateResearchOutput(
    researchOutputData ? researchOutputData.teams.map(({ id }) => id) : [],
  );

  if (researchOutputData && canCreateUpdate) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <Frame title={researchOutputData.title}>
          <TeamOutput
            teamId={researchOutputData.teams[0].id}
            researchOutputData={researchOutputData}
          />
        </Frame>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
