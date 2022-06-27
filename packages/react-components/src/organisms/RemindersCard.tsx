import { css } from '@emotion/react';

import { Card } from '..';
import { lead } from '../colors';
import { infoCircleIcon } from '../icons';
import { perRem } from '../pixels';

const container = css({
  display: 'flex',
  alignItems: 'center',
  color: lead.rgb,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

type ReminderProps = {
  canPublish: boolean;
};

const RemindersCard: React.FC<ReminderProps> = ({ canPublish }) => (
  <Card stroke>
    <div css={container}>
      <span css={[iconStyles]}>{infoCircleIcon}</span>
      {canPublish
        ? 'There are no reminders.'
        : 'Do you have anything to share with the network? Reach out to your Project Manager to add it to the catalog!'}
    </div>
  </Card>
);

export default RemindersCard;
