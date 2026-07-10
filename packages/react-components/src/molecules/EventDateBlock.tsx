import { css } from '@emotion/react';

import { formatDateToTimezone } from '../date';
import { charcoal, mint, paper, steel } from '../colors';
import { rem } from '../pixels';

const containerStyles = css({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  width: rem(96),
  height: rem(96),
  overflow: 'hidden',

  textAlign: 'center',

  backgroundColor: paper.rgb,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: steel.rgb,
  borderRadius: rem(8),
});

const monthStyles = css({
  display: 'block',
  padding: `${rem(4)} 0`,

  backgroundColor: mint.rgb,
  color: charcoal.rgb,

  fontSize: rem(14),
  fontWeight: 'bold',
  letterSpacing: rem(1),
});

const dayStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  color: charcoal.rgb,

  fontSize: rem(30),
  fontWeight: 'bold',
  lineHeight: 1,
});

type EventDateBlockProps = {
  startDate: string;
};

const EventDateBlock: React.FC<EventDateBlockProps> = ({ startDate }) => (
  <div css={containerStyles}>
    <span css={monthStyles}>
      {formatDateToTimezone(startDate, 'MMM').toUpperCase()}
    </span>
    <span css={dayStyles}>{formatDateToTimezone(startDate, 'd')}</span>
  </div>
);

export default EventDateBlock;
