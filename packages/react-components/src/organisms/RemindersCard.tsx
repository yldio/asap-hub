import React, { useState } from 'react';
import { ReminderResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card } from '..';
import { lead, steel } from '../colors';
import { perRem } from '../pixels';
import { Button } from '../atoms';
import ReminderItem from '../molecules/ReminderItem';

const container = css({
  display: 'grid',
  color: lead.rgb,
  padding: `0 ${24 / perRem}em`,
});

const row = css({
  borderBottom: `1px solid ${steel.rgb}`,
  padding: `${12 / perRem}em 0`,
  ':last-child': {
    borderBottom: 'none',
  },
});
const expandLink = css({ justifyContent: 'center', display: 'flex' });

type ReminderProps = {
  canPublish: boolean;
  reminders: ReminderResponse[];
  limit?: number;
};

const RemindersCard: React.FC<ReminderProps> = ({
  canPublish,
  reminders,
  limit,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Card stroke padding={false}>
      <div css={container}>
        {reminders.length ? (
          reminders.slice(0, expanded ? undefined : limit).map((reminder) => (
            <div key={reminder.id} css={row}>
              <ReminderItem {...reminder} />
            </div>
          ))
        ) : (
          <div css={row}>
            <ReminderItem
              description={
                canPublish
                  ? 'There are no reminders.'
                  : 'Do you have anything to share with the network? Reach out to your Project Manager to add it to the catalog!'
              }
            />
          </div>
        )}
        {limit && reminders.length > limit && (
          <div css={[row, expandLink]}>
            <Button onClick={() => setExpanded(!expanded)} linkStyle>
              {expanded ? `Show less ↑` : `Show more ↓`}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RemindersCard;
