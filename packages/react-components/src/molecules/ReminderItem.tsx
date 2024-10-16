import React from 'react';
import { css } from '@emotion/react';
import { ReminderResponse, gp2 as gp2Model } from '@asap-hub/model';

import { perRem } from '../pixels';
import { EventIcon, infoCircleIcon, LibraryIcon } from '../icons';
import { Anchor, Markdown } from '../atoms';
import { neutral200 } from '../colors';

type ReminderEntity =
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

const iconMap: Record<ReminderEntity, React.ReactElement> = {
  Output: <LibraryIcon />,
  'Output Version': <LibraryIcon />,
  'Research Output': <LibraryIcon />,
  'Research Output Version': <LibraryIcon />,
  Event: <EventIcon />,
};

type ReminderProps = Pick<ReminderResponse, 'description' | 'href'> & {
  entity?: ReminderEntity;
};

const ReminderItem: React.FC<ReminderProps> = ({
  entity,
  description,
  href,
}) => {
  const content = (
    <>
      <span css={[iconStyles]}>
        {entity ? iconMap[entity] : infoCircleIcon}
      </span>
      <span css={descriptionStyles}>
        <Markdown value={description} />
      </span>
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
