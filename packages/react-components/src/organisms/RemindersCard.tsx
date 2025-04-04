import React, { ComponentProps, useState } from 'react';
import { ReminderResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card } from '..';
import { lead, steel } from '../colors';
import { perRem } from '../pixels';
import { Button } from '../atoms';
import ReminderItem from '../molecules/ReminderItem';
import { borderRadius } from '../card';

const container = css({
  display: 'grid',
  color: lead.rgb,
  padding: `0 ${24 / perRem}em`,
});

const row = (hasShowMore: boolean) =>
  css({
    borderBottom: `1px solid ${steel.rgb}`,
    padding: `${12 / perRem}em 0`,
    ':last-child': {
      borderBottom: 'none',
    },
    ...(hasShowMore
      ? {
          ':nth-last-of-type(2)': {
            margin: `0 -${24 / perRem}em 0 -${(24 - borderRadius) / perRem}em`,
            padding: `${12 / perRem}em ${24 / perRem}em ${12 / perRem}em ${
              (24 - borderRadius) / perRem
            }em`,
          },
        }
      : {}),
  });
const expandLink = css({ justifyContent: 'center', display: 'flex' });

type ReminderProps = {
  canPublish: boolean;
  reminders: (Pick<ReminderResponse, 'id'> &
    ComponentProps<typeof ReminderItem>)[];
  limit?: number;
};

const RemindersCard: React.FC<ReminderProps> = ({
  canPublish,
  reminders,
  limit,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const hasShowMore = !!(limit && reminders.length > limit);
  return (
    <Card stroke padding={false}>
      <div css={container}>
        {reminders.length ? (
          reminders.slice(0, expanded ? undefined : limit).map((reminder) => (
            <div key={reminder.id} css={row(hasShowMore)}>
              <ReminderItem {...reminder} />
            </div>
          ))
        ) : (
          <div css={row(hasShowMore)}>
            <ReminderItem
              description={
                canPublish
                  ? 'There are no reminders.'
                  : 'Do you have anything to share with the network? Reach out to your Project Manager to add it to the catalog!'
              }
            />
          </div>
        )}
        {hasShowMore && (
          <div css={[row(hasShowMore), expandLink]}>
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
