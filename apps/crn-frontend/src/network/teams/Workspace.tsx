import { useContext, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import {
  NotFoundPage,
  TeamProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import {
  ProjectTool,
  TeamResponse,
  ManuscriptPutRequest,
  DiscussionRequest,
} from '@asap-hub/model';
import { network, useRouteParams } from '@asap-hub/routing';
import { ToastContext, useCurrentUserCRN } from '@asap-hub/react-context';
import { BackendError } from '@asap-hub/frontend-utils';

import {
  useCreateDiscussion,
  useIsComplianceReviewer,
  useManuscriptById,
  useMarkDiscussionAsRead,
  usePutManuscript,
  useReplyToDiscussion,
} from './state';
import { usePatchProjectById, useProjectById } from '../../projects/state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const route = network({}).teams({}).team({ teamId: team.id }).workspace({});
  const { setEligibilityReasons } = useEligibilityReason();
  const isComplianceReviewer = useIsComplianceReviewer();

  const [deleting, setDeleting] = useState(false);
  const patchProject = usePatchProjectById(team.linkedProjectId ?? '');
  const project = useProjectById(team.linkedProjectId ?? '');
  const projectTools = project?.tools ?? [];
  const updateManuscript = usePutManuscript();
  const createDiscussion = useCreateDiscussion();
  const replyToDiscussion = useReplyToDiscussion();
  const markDiscussionAsRead = useMarkDiscussionAsRead();

  const toast = useContext(ToastContext);

  const { setFormType } = useManuscriptToast();
  const user = useCurrentUserCRN();
  const isTeamMember = !!user?.teams.find(({ id }) => team.id === id);

  const handleMarkDiscussionAsRead = async (
    manuscriptId: string,
    discussionId: string,
  ): Promise<void> => {
    await markDiscussionAsRead(manuscriptId, discussionId);
  };

  const handleReplytoDiscussion = async (
    manuscriptId: string,
    discussionId: string,
    patch: DiscussionRequest,
  ): Promise<void> => {
    try {
      await replyToDiscussion(
        manuscriptId,
        discussionId,
        patch as DiscussionRequest,
      );
      setFormType({ type: 'reply-to-discussion', accent: 'successLarge' });
    } catch (error: unknown) {
      if (
        error instanceof BackendError &&
        (error as BackendError).response?.statusCode === 403
      ) {
        setFormType({ type: 'manuscript-status-error', accent: 'error' });
      } else {
        setFormType({ type: 'default-error', accent: 'error' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreateDiscussion = async (
    manuscriptId: string,
    title: string,
    message: string,
  ): Promise<string | undefined> => {
    try {
      const discussionId = await createDiscussion(manuscriptId, title, message);
      setFormType({ type: 'discussion-started', accent: 'successLarge' });
      return discussionId;
    } catch (error: unknown) {
      if (
        error instanceof BackendError &&
        (error as BackendError).response?.statusCode === 403
      ) {
        setFormType({ type: 'manuscript-status-error', accent: 'error' });
      } else {
        setFormType({ type: 'default-error', accent: 'error' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return undefined;
    }
  };

  const { hash: targetManuscript } = useLocation();

  return (
    <>
      <TeamProfileWorkspace
        {...team}
        isTeamMember={isTeamMember}
        setEligibilityReasons={setEligibilityReasons}
        tools={projectTools}
        onUpdateManuscript={(
          manuscriptId: string,
          payload: ManuscriptPutRequest,
        ) => updateManuscript(manuscriptId, payload)}
        onDeleteTool={
          deleting
            ? undefined
            : async (toolIndex) => {
                setDeleting(true);
                if (
                  window.confirm(
                    'Are you sure you want to delete this team tool from your team page? This cannot be undone.',
                  )
                ) {
                  const tools = projectTools.filter((_, i) => i !== toolIndex);
                  await patchProject({ tools: tools as ProjectTool[] }).catch(
                    () => {
                      toast('Something went wrong. Please try again.');
                    },
                  );
                }
                setDeleting(false);
              }
        }
        isComplianceReviewer={isComplianceReviewer}
        createDiscussion={handleCreateDiscussion}
        useManuscriptById={useManuscriptById}
        onReplyToDiscussion={handleReplytoDiscussion}
        onMarkDiscussionAsRead={handleMarkDiscussionAsRead}
        targetManuscriptId={targetManuscript.slice(1)}
        members={team.members ?? []}
      />
      <Routes>
        <Route
          path={route.tools.template.replace(/^\//, '')}
          element={
            <ToolModal
              title="Add Link"
              backHref={route.$}
              onSave={(data: ProjectTool) =>
                patchProject({
                  tools: [...(projectTools as ProjectTool[]), data],
                })
              }
            />
          }
        />
        <Route
          path={`${route.tools.template}${
            route.tools({}).tool.template
          }`.replace(/^\//, '')}
          element={
            <EditTool
              teamId={team.id}
              projectId={team.linkedProjectId ?? ''}
              tools={projectTools as ProjectTool[]}
            />
          }
        />
      </Routes>
    </>
  );
};

const EditTool: React.FC<{
  readonly teamId: TeamResponse['id'];
  readonly projectId: string;
  readonly tools: ReadonlyArray<ProjectTool>;
}> = ({ teamId, projectId, tools }) => {
  const { toolIndex } = useRouteParams(
    network({}).teams({}).team({ teamId }).workspace({}).tools({}).tool,
  );
  const tool = tools[parseInt(toolIndex, 10)];

  const patchProject = usePatchProjectById(projectId);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <ToolModal
      {...tool}
      title="Edit Link"
      backHref={network({}).teams({}).team({ teamId }).workspace({}).$}
      onSave={(data: ProjectTool) => {
        const newTools = [...tools];
        newTools[parseInt(toolIndex, 10)] = data;
        return patchProject({ tools: newTools });
      }}
    />
  );
};

export default Workspace;
