import { DiscussionDataObject } from '@asap-hub/model';
import { ComponentProps, FC, useState } from 'react';
import { Button } from '../atoms';
import { replyIcon } from '../icons';
import { QuickCheckReplyModal } from '../organisms';
import { rem } from '../pixels';

import UserComment from './UserComment';

type DiscussionProps = Pick<
  ComponentProps<typeof QuickCheckReplyModal>,
  'onReplyToDiscussion'
> & {
  id: string;
  getDiscussion: (id: string) => DiscussionDataObject | undefined;
};

const Discussion: FC<DiscussionProps> = ({
  id,
  getDiscussion,
  onReplyToDiscussion,
}) => {
  const discussion = getDiscussion(id);
  const [replyToDiscussion, setReplyToDiscussion] = useState<boolean>(false);
  if (!discussion) {
    return null;
  }
  const { message, replies } = discussion;
  return (
    <>
      {replyToDiscussion && (
        <QuickCheckReplyModal
          onDismiss={() => setReplyToDiscussion(false)}
          discussionId={id}
          onReplyToDiscussion={onReplyToDiscussion}
        />
      )}
      <UserComment {...message} />
      {replies &&
        replies.map((reply, index) => <UserComment {...reply} key={index} />)}
      <div>
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
    </>
  );
};
export default Discussion;
