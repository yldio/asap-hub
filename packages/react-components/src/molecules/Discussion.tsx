import { DiscussionDataObject } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps, FC, useState } from 'react';
import { UserAvatarList } from '..';
import { Button } from '../atoms';
import { minusRectIcon, plusRectIcon, replyIcon } from '../icons';
import { DiscussionModal } from '../organisms';
import { rem } from '../pixels';

import UserComment from './UserComment';

type DiscussionProps = Pick<
  ComponentProps<typeof DiscussionModal>,
  'onSave'
> & {
  id: string;
  canReply: boolean;
  modalTitle: string;
  getDiscussion: (id: string) => DiscussionDataObject | undefined;
};

const iconStyles = css({
  display: 'inline-block',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(12),
  alignSelf: 'start',
});

const replyContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
});

const replyAvatarsStyles = css({
  display: 'flex',
  alignItems: 'center',
  marginTop: rem(-12),
  gap: rem(8),
});

const Discussion: FC<DiscussionProps> = ({
  id,
  canReply,
  modalTitle,
  getDiscussion,
  onSave,
}) => {
  const discussion = getDiscussion(id);
  const [replyToDiscussion, setReplyToDiscussion] = useState<boolean>(false);
  const [expandReplies, setExpandReplies] = useState<boolean>(false);
  if (!discussion) {
    return null;
  }
  const { message, replies } = discussion;
  const hasReplies = replies && replies.length > 0;
  const displayReplyButton =
    canReply && (!hasReplies || (hasReplies && expandReplies));
  return (
    <>
      {replyToDiscussion && (
        <DiscussionModal
          title={modalTitle}
          editorLabel="Please provide details"
          ruleMessage="Reply cannot exceed 256 characters."
          discussionType="replyText"
          onDismiss={() => setReplyToDiscussion(false)}
          discussionId={id}
          onSave={onSave}
        />
      )}
      <UserComment {...message} />
      {hasReplies && (
        <div>
          <div css={replyContainerStyles}>
            <span css={[iconStyles]}>
              <Button
                data-testid="discussion-collapsible-button"
                linkStyle
                onClick={() => setExpandReplies(!expandReplies)}
              >
                <span>{expandReplies ? minusRectIcon : plusRectIcon}</span>
              </Button>
            </span>
            {expandReplies ? (
              <div>
                {replies.map((reply, index) => (
                  <UserComment {...reply} key={index} />
                ))}
              </div>
            ) : (
              <div css={replyAvatarsStyles}>
                <UserAvatarList
                  members={replies.map((reply) => reply.createdBy)}
                  onClick={() => setExpandReplies(true)}
                  small
                />
                <Button linkStyle onClick={() => setExpandReplies(true)}>
                  <span css={{ fontSize: rem(14) }}>
                    {replies.length} repl{replies.length !== 1 ? 'ies' : 'y'}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {displayReplyButton && (
        <div css={hasReplies && { paddingLeft: rem(36) }}>
          <Button noMargin small onClick={() => setReplyToDiscussion(true)}>
            <span
              css={{
                display: 'inline-flex',
                gap: rem(8),
                margin: `0 ${rem(8)} 0 0`,
              }}
            >
              {replyIcon} Reply
            </span>
          </Button>
        </div>
      )}
    </>
  );
};
export default Discussion;
