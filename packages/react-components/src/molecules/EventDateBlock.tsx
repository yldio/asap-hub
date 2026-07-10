import { css } from '@emotion/react';

import { formatDateToTimezone } from '../date';
import { charcoal, mint, steel } from '../colors';
import { rem } from '../pixels';

const containerStyles = css({
  flexShrink: 0,
  width: rem(72),
  overflow: 'hidden',

  textAlign: 'center',

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
  display: 'block',
  padding: `${rem(8)} 0`,

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
