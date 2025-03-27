import { DiscussionCreateRequest } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import { DiscussionModal } from '.';

import { Button } from '../atoms';
import { replyIcon } from '../icons';
import { rem } from '../pixels';

const buttonStyles = css({
  display: 'flex',
  gap: rem(8),
  margin: `0 ${rem(8)} 0 0`,
  path: {
    stroke: '#FFFFFF',
  },
});

type DiscussionsTabProps = {
  manuscriptId: string;
  createDiscussion: (
    manuscriptId: string,
    title: string,
    message: string,
  ) => Promise<string>;
};

const DiscussionsTab: React.FC<DiscussionsTabProps> = ({
  createDiscussion,
  manuscriptId,
}) => {
  const [displayDiscussionModal, setDisplayDiscussionModal] = useState(false);

  const handleSave = async (data: DiscussionCreateRequest) => {
    if (!data.title) return;
    await createDiscussion(manuscriptId, data.title, data.text);
  };
  return (
    <div>
      <Button
        primary
        small
        noMargin
        onClick={() => setDisplayDiscussionModal(true)}
      >
        <span css={buttonStyles}>{replyIcon}Start Discussion</span>
      </Button>
      {displayDiscussionModal && (
        <DiscussionModal
          type="start"
          onDismiss={() => setDisplayDiscussionModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DiscussionsTab;
