import { NotFoundPage, SharedResearchOutput } from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { useRouteMatch, Route } from 'react-router-dom';

import { useBackHref } from '../hooks';
import { useResearchOutputById } from './state';
import { useCanCreateUpdateResearchOutput } from '../network/teams/state';
import TeamOutput from '../network/teams/TeamOutput';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const { path } = useRouteMatch();
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref = useBackHref() ?? sharedResearch({}).$;
  const canCreateUpdate = useCanCreateUpdateResearchOutput(
    researchOutputData ? researchOutputData.teams.map(({ id }) => id) : [],
  );

  if (researchOutputData) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <Route exact path={path}>
          <Frame title={researchOutputData.title}>
            <SharedResearchOutput {...researchOutputData} backHref={backHref} />
          </Frame>
        </Route>
        {canCreateUpdate ? (
          <Route
            path={
              path +
              sharedResearch({}).researchOutput({ researchOutputId })
                .editResearchOutput.template
            }
          >
            <TeamOutput
              teamId={researchOutputData.teams[0].id}
              researchOutputData={researchOutputData}
            />
          </Route>
        ) : (
          <NotFoundPage />
        )}
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
