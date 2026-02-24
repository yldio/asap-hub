import { FC } from 'react';
import { ManuscriptPutRequest, DiscussionRequest } from '@asap-hub/model';
import { ProjectProfileWorkspace } from '@asap-hub/react-components';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  useCreateDiscussion,
  useIsComplianceReviewer,
  useManuscriptById,
  useMarkDiscussionAsRead,
  usePutManuscript,
  useReplyToDiscussion,
} from '../network/teams/state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';

type ProjectWorkspaceProps = Omit<
  React.ComponentProps<typeof ProjectProfileWorkspace>,
  | 'setEligibilityReasons'
  | 'useManuscriptById'
  | 'onUpdateManuscript'
  | 'isComplianceReviewer'
  | 'createDiscussion'
  | 'onReplyToDiscussion'
  | 'onMarkDiscussionAsRead'
>;

const ProjectWorkspace: FC<ProjectWorkspaceProps> = (props) => {
  const { setEligibilityReasons } = useEligibilityReason();
  const isComplianceReviewer = useIsComplianceReviewer();
  const updateManuscript = usePutManuscript();
  const createDiscussion = useCreateDiscussion();
  const replyToDiscussion = useReplyToDiscussion();
  const markDiscussionAsRead = useMarkDiscussionAsRead();
  const { setFormType } = useManuscriptToast();

  const handleUpdateManuscript = (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => updateManuscript(manuscriptId, payload);

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

  const handleReplyToDiscussion = async (
    manuscriptId: string,
    discussionId: string,
    patch: DiscussionRequest,
  ): Promise<void> => {
    try {
      await replyToDiscussion(manuscriptId, discussionId, patch);
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

  const handleMarkDiscussionAsRead = async (
    manuscriptId: string,
    discussionId: string,
  ): Promise<void> => {
    await markDiscussionAsRead(manuscriptId, discussionId);
  };

  return (
    <ProjectProfileWorkspace
      {...props}
      setEligibilityReasons={setEligibilityReasons}
      isComplianceReviewer={isComplianceReviewer}
      useManuscriptById={useManuscriptById}
      onUpdateManuscript={handleUpdateManuscript}
      createDiscussion={handleCreateDiscussion}
      onReplyToDiscussion={handleReplyToDiscussion}
      onMarkDiscussionAsRead={handleMarkDiscussionAsRead}
    />
  );
};

export default ProjectWorkspace;
