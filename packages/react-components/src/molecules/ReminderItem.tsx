import React from 'react';
import { css } from '@emotion/react';
import { ReminderResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { calendarIcon, eventIcon, infoCircleIcon } from '../icons';
import { Anchor } from '../atoms';
import { neutral200 } from '../colors';

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

const iconMap: Record<ReminderResponse['entity'], React.ReactElement> = {
  'Research Output': calendarIcon,
  Event: eventIcon,
};

type ReminderProps = Pick<ReminderResponse, 'description' | 'href'> & {
  entity?: ReminderResponse['entity'];
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
      <span>{description}</span>
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
