import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  ScrollToTop,
  SharedResearchOutput,
  utils,
} from '@asap-hub/react-components';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
} from '@asap-hub/react-context';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { isResearchOutputWorkingGroup } from '@asap-hub/validation';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';

import { ManuscriptVersionResponse } from '@asap-hub/model';
import { useEffect, useState } from 'react';
import { useLatestManuscriptVersionByManuscriptId } from '../network/teams/state';
import TeamOutput from '../network/teams/TeamOutput';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';
import { usePutResearchOutput } from '../shared-state';
import { useResearchOutputById, useResearchOutputPermissions } from './state';

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

  const { path } = useRouteMatch();
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
  const getLatestManuscriptVersion = useLatestManuscriptVersionByManuscriptId();

  const [latestManuscriptVersion, setLatestManuscriptVersion] = useState<
    ManuscriptVersionResponse | undefined
  >();

  useEffect(() => {
    if (researchOutputData?.relatedManuscript) {
      getLatestManuscriptVersion(researchOutputData?.relatedManuscript)
        .then((data) => setLatestManuscriptVersion(data))
        .catch(() => {
          setLatestManuscriptVersion(undefined);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchOutputData?.relatedManuscript]);

  const checkForNewVersion = async (): Promise<boolean> => {
    if (!researchOutputData?.relatedManuscript) return false;

    try {
      const latest = await getLatestManuscriptVersion(
        researchOutputData.relatedManuscript,
      );

      setLatestManuscriptVersion(latest);

      return (
        !!latest?.versionId &&
        latest.versionId !== researchOutputData.relatedManuscriptVersion
      );
    } catch (error) {
      setLatestManuscriptVersion(undefined);
      return false;
    }
  };

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
                checkForNewVersion={checkForNewVersion}
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
                    latestManuscriptVersion={latestManuscriptVersion}
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
