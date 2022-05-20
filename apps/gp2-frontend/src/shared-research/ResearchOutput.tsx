import { NotFoundPage, SharedResearchOutput } from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';

import { useBackHref } from '../hooks';
import { useResearchOutputById } from './state';
import { useCanCreateUpdateResearchOutput } from '../network/teams/state';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref = useBackHref() ?? sharedResearch({}).$;
  const canCreateUpdate = useCanCreateUpdateResearchOutput(
    researchOutputData ? researchOutputData.teams.map(({ id }) => id) : [],
  );

  if (researchOutputData) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <Frame title={researchOutputData.title}>
          <SharedResearchOutput {...researchOutputData} backHref={backHref} />
        </Frame>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
