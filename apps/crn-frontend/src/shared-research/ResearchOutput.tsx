import { NotFoundPage, SharedResearchOutput } from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { useRouteMatch, Route } from 'react-router-dom';
import { isResearchOutputWorkingGroup } from '@asap-hub/validation';

import { useResearchOutputById, useUserPerrmisions } from './state';
import TeamOutput from '../network/teams/TeamOutput';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const { path } = useRouteMatch();
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref = useBackHref() ?? sharedResearch({}).$;

  const permissions = useUserPerrmisions(researchOutputData);

  if (researchOutputData) {
    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canCreateUpdate: permissions.editPublished }}
      >
        <Route exact path={path}>
          <Frame title={researchOutputData.title}>
            <SharedResearchOutput {...researchOutputData} backHref={backHref} />
          </Frame>
        </Route>
        <Route
          path={
            path +
            sharedResearch({}).researchOutput({ researchOutputId })
              .editResearchOutput.template
          }
        >
          {isResearchOutputWorkingGroup(researchOutputData) ? (
            <WorkingGroupOutput
              workingGroupId={researchOutputData.workingGroups[0]?.id}
              researchOutputData={researchOutputData}
            />
          ) : (
            <TeamOutput
              teamId={researchOutputData.teams[0]?.id}
              researchOutputData={researchOutputData}
            />
          )}
        </Route>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
