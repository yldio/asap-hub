import { useContext, useState } from 'react';
import { useRouteMatch, Route, useLocation, Match } from 'react-router-dom';
import {
  NotFoundPage,
  TeamProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import {
  TeamTool,
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
  usePatchTeamById,
  usePutManuscript,
  useReplyToDiscussion,
} from './state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const route = network({}).teams({}).team({ teamId: team.id }).workspace({});
  const { path } = useRouteMatch() as Match<{ path: string }>;
  const { setEligibilityReasons } = useEligibilityReason();
  const isComplianceReviewer = useIsComplianceReviewer();

  const [deleting, setDeleting] = useState(false);
  const patchTeam = usePatchTeamById(team.id);
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
      <Route path={path}>
        <TeamProfileWorkspace
          {...team}
          isTeamMember={isTeamMember}
          setEligibilityReasons={setEligibilityReasons}
          tools={team.tools}
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
                    await patchTeam({
                      tools: team.tools.filter((_, i) => toolIndex !== i),
                    }).catch(() => {
                      toast('Something went wrong. Please try again.');
                    });
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
        />
      </Route>
      <Route exact path={path + route.tools.template}>
        <ToolModal
          title="Add Link"
          backHref={route.$}
          onSave={(data: TeamTool) =>
            patchTeam({
              tools: [...(team.tools ?? []), data],
            })
          }
        />
      </Route>
      <Route
        exact
        path={path + route.tools.template + route.tools({}).tool.template}
      >
        <EditTool teamId={team.id} tools={team.tools} />
      </Route>
    </>
  );
};

const EditTool: React.FC<{
  readonly teamId: TeamResponse['id'];
  readonly tools: ReadonlyArray<TeamTool>;
}> = ({ teamId, tools }) => {
  const { toolIndex } = useRouteParams(
    network({}).teams({}).team({ teamId }).workspace({}).tools({}).tool,
  );
  const tool = tools[parseInt(toolIndex, 10)];

  const patchTeam = usePatchTeamById(teamId);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <ToolModal
      {...tool}
      title="Edit Link"
      backHref={network({}).teams({}).team({ teamId }).workspace({}).$}
      onSave={(data: TeamTool) =>
        patchTeam({
          tools: Object.assign([], tools, { [toolIndex]: data }),
        })
      }
    />
  );
};

export default Workspace;
