import React from 'react';
import { css } from '@emotion/react';
import { ReminderResponse, gp2 as gp2Model } from '@asap-hub/model';

import { perRem } from '../pixels';
import { EventIcon, infoCircleIcon, LibraryIcon, article } from '../icons';
import { Anchor, Markdown } from '../atoms';
import { neutral200, cerulean } from '../colors';

export type ReminderEntity =
  | ReminderResponse['entity']
  | gp2Model.ReminderResponse['entity'];

const containerStyle = css({
  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: 'min-content 1fr',
  columnGap: `${15 / perRem}em`,
  alignContent: 'center',
  padding: `${8 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
});

const linkStyles = css({
  ':hover': {
    borderRadius: `${3 / perRem}em`,
    background: neutral200.rgb,
  },
});

const descriptionStyles = css({
  '& div > p': {
    margin: '0',
  },
});

const subtextStyles = css({
  display: 'flex',
  alignItems: 'start',
  marginTop: `${12 / perRem}em`,
  gap: `${8 / perRem}em`,
});

const timeElapsedStyles = css({
  color: cerulean.rgb,
});

const iconMap: Record<ReminderEntity, React.ReactElement> = {
  Output: <LibraryIcon />,
  'Output Version': <LibraryIcon />,
  'Research Output': <LibraryIcon />,
  'Research Output Version': <LibraryIcon />,
  Event: <EventIcon />,
  Manuscript: <LibraryIcon />,
};

type ReminderProps = Pick<
  ReminderResponse,
  'description' | 'href' | 'date' | 'subtext'
> & {
  entity?: ReminderEntity;
};

export const getTimeElapsed = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();

  const secondsElapsed = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsElapsed < 3600) {
    return `${Math.floor(secondsElapsed / 60)}m`;
  }
  if (secondsElapsed < 86400) {
    return `${Math.floor(secondsElapsed / 3600)}h`;
  }
  return `${Math.floor(secondsElapsed / 86400)}d`;
};

  const date = new Date(isoDate);
  const now = new Date();

  const secondsElapsed = (now.getTime() - date.getTime()) / 1000;

  const oneHourInSeconds = 3600;
  if (secondsElapsed < oneHourInSeconds) {
    const minutes = Math.floor(secondsElapsed / 60);
    return `${minutes}m`;
  }

  const oneDayInSeconds = 86400;
  if (secondsElapsed < oneDayInSeconds) {
    const hours = Math.floor(secondsElapsed / 3600);
    return `${hours}h`;
  }

  const days = Math.floor(secondsElapsed / 86400);
  return `${days}d`;
};

const ReminderItem: React.FC<ReminderProps> = ({
  entity,
  description,
  subtext,
  href,
  date,
}) => {
  const content = (
    <>
      <span css={iconStyles}>{entity ? iconMap[entity] : infoCircleIcon}</span>
      <span css={descriptionStyles}>
        <Markdown value={description} />
        {subtext && (
          <div css={subtextStyles}>
            <span css={iconStyles}>{article}</span>
            <span>{subtext}</span>
          </div>
        )}
      </span>
      {date && <span css={timeElapsedStyles}>{getTimeElapsed(date)}</span>}
    </>
  );

  return href ? (
    <Anchor href={href} css={[containerStyle, linkStyles]}>
      {content}
    </Anchor>
  ) : (
    <div css={containerStyle}>{content}</div>
  );
};

export default ReminderItem;
