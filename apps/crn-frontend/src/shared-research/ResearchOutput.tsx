import {
  NotFoundPage,
  SharedResearchOutput,
  utils,
  ScrollToTop,
} from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
} from '@asap-hub/react-context';
import {
  Match,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { isResearchOutputWorkingGroup } from '@asap-hub/validation';

import { useResearchOutputById, useResearchOutputPermissions } from './state';
import TeamOutput from '../network/teams/TeamOutput';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';
import { usePutResearchOutput } from '../shared-state';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );

  const publishedNowPath = useRouteMatch({
    path: sharedResearch({})
      .researchOutput({ researchOutputId })
      .researchOutputPublished({ researchOutputId }).$,
    exact: true,
  })?.path;

  const publishedNow = !!publishedNowPath;

  const { path } = useRouteMatch() as Match<{ path: string }>;
  const urlSearchParams = new URLSearchParams(useLocation().search);
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
    researchOutputData?.published,
  );

  const updateResearchOutput = usePutResearchOutput();
  const publishResearchOutput = usePutResearchOutput(true);

  const currentUser = useCurrentUserCRN();

  if (researchOutputData) {
    return (
      <ResearchOutputPermissionsContext.Provider value={permissions}>
        <Switch>
          <Route exact path={publishedNow ? publishedNowPath : path}>
            <Frame title={researchOutputData.title}>
              {publishedNow && <ScrollToTop />}
              <SharedResearchOutput
                {...researchOutputData}
                backHref={backHref}
                onRequestReview={(shouldReview) =>
                  updateResearchOutput(researchOutputData.id, {
                    ...utils.transformResearchOutputResponseToRequest(
                      researchOutputData,
                    ),
                    statusChangedById: currentUser?.id,
                    hasStatusChanged: true,
                    isInReview: shouldReview,
                  })
                }
                onPublish={() =>
                  publishResearchOutput(researchOutputData.id, {
                    ...utils.transformResearchOutputResponseToRequest(
                      researchOutputData,
                    ),
                    statusChangedById: currentUser?.id,
                    hasStatusChanged: true,
                    isInReview: false,
                    published: true,
                  })
                }
                publishedNow={publishedNow}
                draftCreated={urlSearchParams.get('draftCreated') === 'true'}
              />
            </Frame>
          </Route>
          {permissions.canVersionResearchOutput && (
            <Route
              path={
                path +
                sharedResearch({}).researchOutput({ researchOutputId })
                  .versionResearchOutput.template
              }
            >
              {isLinkedToWorkingGroup ? (
                <WorkingGroupOutput
                  workingGroupId={researchOutputData.workingGroups[0]?.id}
                  researchOutputData={researchOutputData}
                  versionAction={'create'}
                />
              ) : (
                researchOutputData.teams[0]?.id && (
                  <TeamOutput
                    teamId={researchOutputData.teams[0]?.id}
                    researchOutputData={researchOutputData}
                    versionAction={'create'}
                  />
                )
              )}
            </Route>
          )}
          {permissions.canEditResearchOutput && (
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
                  versionAction={'edit'}
                />
              ) : (
                researchOutputData.teams[0]?.id && (
                  <TeamOutput
                    teamId={researchOutputData.teams[0].id}
                    researchOutputData={researchOutputData}
                    versionAction={'edit'}
                  />
                )
              )}
            </Route>
          )}
          <NotFoundPage />
        </Switch>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
