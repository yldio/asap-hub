import {
  NotFoundPage,
  SharedResearchOutput,
  utils,
  ScrollToTop,
} from '@asap-hub/react-components';
import { sharedResearchRoutes } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
} from '@asap-hub/react-context';
import { Route, Routes, useLocation, useMatch } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { isResearchOutputWorkingGroup } from '@asap-hub/validation';

import { useResearchOutputById, useResearchOutputPermissions } from './state';
import TeamOutput from '../network/teams/TeamOutput';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';
import { usePutResearchOutput } from '../shared-research';

const ResearchOutput: React.FC = () => {
  const route = sharedResearchRoutes.DEFAULT.$.DETAILS;

  const { researchOutputId } = useTypedParams(route);
  const publishedNowPath = useMatch({
    path: sharedResearchRoutes.DEFAULT.DETAILS.PUBLISH_RESEARCH_OUTPUT.buildPath(
      { researchOutputId },
    ),
  })?.pathname;

  const publishedNow = !!publishedNowPath;

  const urlSearchParams = new URLSearchParams(useLocation().search);
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref =
    useBackHref() ?? sharedResearchRoutes.DEFAULT.$.LIST.relativePath;

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
        <Routes>
          <Route
            path={publishedNow ? publishedNowPath : ''}
            element={
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
            }
          />
          {permissions.canVersionResearchOutput && (
            <Route
              path={
                //'version/:researchOutputId'
                route.$.VERSION_RESEARCH_OUTPUT.relativePath
                // path +
                // sharedResearch({}).researchOutput({ researchOutputId })
                //   .versionResearchOutput.template
              }
              element={
                isLinkedToWorkingGroup ? (
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
                )
              }
            />
          )}
          {permissions.canEditResearchOutput && (
            <Route
              path={
                //'edit/:researchOutputId'
                route.$.EDIT_RESEARCH_OUTPUT.relativePath
                // sharedResearch({}).researchOutput({ researchOutputId })
                //   .editResearchOutput.template
              }
              element={
                isLinkedToWorkingGroup ? (
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
                )
              }
            />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
