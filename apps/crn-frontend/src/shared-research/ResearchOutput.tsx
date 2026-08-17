import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  Loading,
  NotFoundPage,
  ResearchOutputToast,
  ResearchOutputToastLocationState,
  ScrollToTop,
  SharedResearchOutput,
  utils,
} from '@asap-hub/react-components';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
} from '@asap-hub/react-context';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';
import { getResearchOutputEntityType } from '@asap-hub/validation';
import { Route, Routes, useLocation, useNavigate } from 'react-router';

import {
  ManuscriptVersionResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { Suspense, useEffect, useState } from 'react';
import { useLatestManuscriptVersionByManuscriptId } from '../network/teams/state';
import WorkingGroupOutput from '../network/working-groups/WorkingGroupOutput';
import TeamBasedOutput from '../projects/TeamBasedOutput';
import UserBasedOutput from '../projects/UserBasedOutput';
import { usePutResearchOutput } from '../shared-state';
import { useResearchOutputById, useResearchOutputPermissions } from './state';

const entityAssociation = {
  'working-group': 'workingGroups',
  project: 'projects',
  team: 'teams',
} as const;

const getAssociationIds = (researchOutputData: ResearchOutputResponse) => {
  const entityType = getResearchOutputEntityType(researchOutputData);

  switch (entityType) {
    case 'working-group':
      return researchOutputData.workingGroups?.map((wg) => wg.id) ?? [];
    case 'project':
      return researchOutputData.project?.id
        ? [researchOutputData.project.id]
        : [];
    case 'team':
    default:
      return researchOutputData.teams.map((team) => team.id);
  }
};

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );

  const location = useLocation();
  const navigate = useNavigate();

  const outputPath = sharedResearch({}).researchOutput({ researchOutputId }).$;

  const [toast, setToast] = useState<ResearchOutputToast | undefined>();

  useEffect(() => {
    const stateToast = (
      location.state as ResearchOutputToastLocationState | null
    )?.toast;
    if (stateToast) {
      setToast(stateToast);
      void navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: null,
      });
    } else if (location.pathname !== outputPath) {
      setToast(undefined);
    }
  }, [
    location.pathname,
    location.search,
    location.state,
    navigate,
    outputPath,
  ]);

  const researchOutputData = useResearchOutputById(researchOutputId);

  const backHref = useBackHref() ?? sharedResearch({}).$;

  const entityType = researchOutputData
    ? getResearchOutputEntityType(researchOutputData)
    : 'team';
  const association = entityAssociation[entityType];
  const associationIds = researchOutputData
    ? getAssociationIds(researchOutputData)
    : [];

  const permissions = useResearchOutputPermissions(
    association,
    associationIds,
    researchOutputData?.published,
    !!researchOutputData?.relatedManuscriptVersion,
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
    const renderOutputForm = (versionAction: 'create' | 'edit') => {
      switch (entityType) {
        case 'working-group':
          return researchOutputData.workingGroups?.[0]?.id ? (
            <WorkingGroupOutput
              workingGroupId={researchOutputData.workingGroups[0].id}
              researchOutputData={researchOutputData}
              versionAction={versionAction}
            />
          ) : (
            <NotFoundPage />
          );
        case 'project':
          return researchOutputData.project?.id ? (
            <UserBasedOutput
              projectId={researchOutputData.project.id}
              researchOutputData={researchOutputData}
              latestManuscriptVersion={
                versionAction === 'create' ? latestManuscriptVersion : undefined
              }
              versionAction={versionAction}
            />
          ) : (
            <NotFoundPage />
          );
        case 'team':
          return researchOutputData.teams[0]?.id ? (
            <TeamBasedOutput
              teamId={researchOutputData.teams[0].id}
              researchOutputData={researchOutputData}
              latestManuscriptVersion={
                versionAction === 'create' ? latestManuscriptVersion : undefined
              }
              versionAction={versionAction}
            />
          ) : (
            <NotFoundPage />
          );
        default:
          return <NotFoundPage />;
      }
    };

    const renderResearchOutputView = () => (
      <Frame title={researchOutputData.title}>
        {toast === 'published' && <ScrollToTop />}
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
          toast={toast}
          checkForNewVersion={checkForNewVersion}
        />
      </Frame>
    );

    return (
      <ResearchOutputPermissionsContext.Provider value={permissions}>
        <Suspense key={location.pathname} fallback={<Loading />}>
          <Routes>
            <Route index element={renderResearchOutputView()} />
            {permissions.canVersionResearchOutput && (
              <Route
                path={
                  sharedResearch({}).researchOutput({ researchOutputId })
                    .versionResearchOutput.template
                }
                element={renderOutputForm('create')}
              />
            )}
            {permissions.canEditResearchOutput && (
              <Route
                path={
                  sharedResearch({}).researchOutput({ researchOutputId })
                    .editResearchOutput.template
                }
                element={renderOutputForm('edit')}
              />
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ResearchOutputPermissionsContext.Provider>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
