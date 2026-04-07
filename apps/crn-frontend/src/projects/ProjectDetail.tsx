import { FC, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  ProjectDetailMilestones,
  NotFoundPage,
} from '@asap-hub/react-components';
import { isProjectMilestoneLead } from '@asap-hub/model';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { useProjectById, useCreateMilestone } from './state';
import { useFetchArticles } from './aim-articles-state';
import { useRelatedResearchSuggestions } from '../shared-state/shared-research';
import { ManuscriptToastProvider } from '../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../network/teams/EligibilityReasonProvider';
import ProjectWorkspace from './ProjectWorkspace';
import type { ProjectDetailConfig } from './projectDetailConfig';

const loadProjectManuscript = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectManuscript');
const ProjectManuscript = lazy(loadProjectManuscript);

type Props = {
  config: ProjectDetailConfig;
};

const ProjectDetail: FC<Props> = ({ config }) => {
  const { projectId: rawProjectId } = useParams<{ projectId: string }>();
  const projectId = rawProjectId ?? '';
  const projectDetail = useProjectById(projectId);
  const fetchArticles = useFetchArticles();
  const { isEnabled } = useFlags();
  const user = useCurrentUserCRN();
  const isStaff = user?.role === 'Staff';
  const { hash: targetManuscript } = useLocation();
  const createMilestone = useCreateMilestone(projectId);
  const getArticleSuggestions = useRelatedResearchSuggestions();

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  if (projectDetail.projectType !== config.projectType) {
    return <NotFoundPage />;
  }

  const route = config.getRoute(projectId);

  const isProjectMember = !!user?.projects.find(({ id }) => id === projectId);
  const showWorkspace =
    isEnabled('PROJECT_WORKSPACE') && (isProjectMember || isStaff);
  const workspaceHref = showWorkspace ? route.workspace({}).$ : undefined;
  const isProjectMilestonesEnabled = isEnabled('PROJECT_AIMS_AND_MILESTONES');
  const milestonesHref = route.milestones({}).$;

  const isLead = user ? isProjectMilestoneLead(projectDetail, user) : false;

  const hasSupplementGrant =
    'supplementGrant' in projectDetail && !!projectDetail.supplementGrant;

  const originalGrantAims =
    'originalGrantAims' in projectDetail
      ? projectDetail.originalGrantAims
      : undefined;

  const supplementGrantAims =
    'supplementGrant' in projectDetail
      ? projectDetail.supplementGrant?.aims
      : undefined;

  return (
    <Frame title={projectDetail.title || ''}>
      <ManuscriptToastProvider>
        <EligibilityReasonProvider>
          <ProjectDetailPage
            {...projectDetail}
            pointOfContactEmail={projectDetail.contactEmail || undefined}
            aboutHref={route.about({}).$}
            workspaceHref={workspaceHref}
            milestonesHref={milestonesHref}
          >
            <Routes>
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).createManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).editManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).resubmitManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                      resubmitManuscript
                    />
                  }
                />
              )}
              <Route
                path="about"
                element={
                  <ProjectDetailAbout
                    {...projectDetail}
                    pointOfContactEmail={
                      projectDetail.contactEmail || undefined
                    }
                    fetchArticles={fetchArticles}
                    seeMilestonesHref={milestonesHref}
                  />
                }
              />
              <Route
                path="milestones"
                element={
                  isProjectMilestonesEnabled ? (
                    <ProjectDetailMilestones
                      milestones={projectDetail.milestones ?? []}
                      seeAimsHref={route.about({}).$}
                      hasSupplementGrant={hasSupplementGrant}
                      isLead={isLead}
                      loadArticleOptions={getArticleSuggestions}
                      originalGrantAims={originalGrantAims}
                      supplementGrantAims={supplementGrantAims}
                      onCreateMilestone={createMilestone}
                      getArticleSuggestions={getArticleSuggestions}
                      pageControlsProps={{
                        numberOfPages: 1,
                        currentPageIndex: 0,
                        renderPageHref: (index: number) =>
                          route.milestones({}).$ +
                          (index > 0 ? `?page=${index + 1}` : ''),
                      }}
                    />
                  ) : (
                    <NotFoundPage />
                  )
                }
              />
              {showWorkspace && (
                <Route
                  path="workspace/*"
                  element={
                    <ProjectWorkspace
                      id={projectId}
                      isProjectMember={isProjectMember}
                      isTeamBased={config.getIsTeamBased(projectDetail)}
                      manuscripts={projectDetail.manuscripts ?? []}
                      collaborationManuscripts={
                        projectDetail.collaborationManuscripts ?? []
                      }
                      tools={projectDetail.tools ?? []}
                      lastModifiedDate={new Date().toISOString()}
                      contactEmail={projectDetail.contactEmail || undefined}
                      contactName={config.getContactName(projectDetail)}
                      toolsHref={route.workspace({}).tools({}).$}
                      editToolHref={(index) =>
                        route
                          .workspace({})
                          .tools({})
                          .tool({ toolIndex: `${index}` }).$
                      }
                      isActiveProject={projectDetail.status === 'Active'}
                      createManuscriptHref={
                        route.workspace({}).createManuscript({}).$
                      }
                      targetManuscriptId={targetManuscript.slice(1)}
                      workspaceHref={route.workspace({}).$}
                    />
                  }
                />
              )}
              <Route
                index
                element={<Navigate to={route.about({}).$} replace />}
              />
            </Routes>
          </ProjectDetailPage>
        </EligibilityReasonProvider>
      </ManuscriptToastProvider>
    </Frame>
  );
};

export default ProjectDetail;
