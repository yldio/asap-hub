import { NotFoundPage, SharedResearchOutput } from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { useRouteMatch, Route } from 'react-router-dom';
import { isResearchOutputWorkingGroup } from '@asap-hub/validation';

import { useResearchOutputById, useResearchOutputPermissions } from './state';
import TeamOutput from '../network/teams/TeamOutput';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );

  const publishedNowPath = useRouteMatch({
    path: `${
      sharedResearch({}).researchOutput({ researchOutputId }).$
    }/publishedNow`,
    exact: true,
  })?.path;

  const publishedNow = !!publishedNowPath;

  const { path } = useRouteMatch();
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref = useBackHref() ?? sharedResearch({}).$;

  const isLinkedToWorkingGroup =
    researchOutputData && isResearchOutputWorkingGroup(researchOutputData);

  const association = isLinkedToWorkingGroup ? 'workingGroups' : 'teams';
  const associationIds = isLinkedToWorkingGroup
    ? researchOutputData?.workingGroups.map((wg) => wg.id) || []
    : researchOutputData?.teams.map((team) => team.id) || [];

  const permissions = useResearchOutputPermissions(
    association,
    associationIds,
    researchOutputData ? researchOutputData.published : false,
  );

  if (researchOutputData) {
    return (
      <ResearchOutputPermissionsContext.Provider value={permissions}>
        <Route exact path={publishedNow ? publishedNowPath : path}>
          <Frame title={researchOutputData.title}>
            <SharedResearchOutput
              {...researchOutputData}
              backHref={backHref}
              publishedNow={publishedNow}
            />
          </Frame>
        </Route>
        <Route
          path={
            path +
            sharedResearch({}).researchOutput({ researchOutputId })
              .editResearchOutput.template
          }
        >
          {isLinkedToWorkingGroup ? (
            <WorkingGroupOutput
              workingGroupId={researchOutputData.workingGroups[0]?.id}
              researchOutputData={researchOutputData}
            />
          ) : (
            researchOutputData.teams[0]?.id && (
              <TeamOutput
                teamId={researchOutputData.teams[0].id}
                researchOutputData={researchOutputData}
              />
            )
          )}
        </Route>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
