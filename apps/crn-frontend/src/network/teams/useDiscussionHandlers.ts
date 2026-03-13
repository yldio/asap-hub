import { DiscussionRequest } from '@asap-hub/model';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  useCreateDiscussion,
  useMarkDiscussionAsRead,
  useReplyToDiscussion,
} from './state';
import { useManuscriptToast } from './useManuscriptToast';

const useDiscussionHandlers = () => {
  const createDiscussion = useCreateDiscussion();
  const replyToDiscussion = useReplyToDiscussion();
  const markDiscussionAsRead = useMarkDiscussionAsRead();
  const { setFormType } = useManuscriptToast();

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

  return {
    handleCreateDiscussion,
    handleReplyToDiscussion,
    handleMarkDiscussionAsRead,
  };
};

export default useDiscussionHandlers;
