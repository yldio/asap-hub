import { css } from '@emotion/react';

import { ProgressBar, ProgressWheel } from '../atoms';
import { charcoal, ember, fern, lead, pearl, steel } from '../colors';
import { rem, tabletScreen } from '../pixels';
import { headlineStyles } from '../text';

const containerStyles = css({
  boxSizing: 'border-box',
  padding: rem(24),

  backgroundColor: pearl.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
});

const labelStyles = css({
  margin: 0,
  color: lead.rgb,
  fontSize: rem(17),
  lineHeight: rem(24),
});

const valueStyles = css(headlineStyles[1], {
  margin: 0,
  color: charcoal.rgb,
});

const progressRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(24),
});

const wheelStyles = css({
  display: 'none',
  flexShrink: 0,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'flex',
  },
});

const barStyles = css({
  marginTop: rem(16),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'none',
  },
});

const deltaRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const arrowStyles = (direction: 'up' | 'down') =>
  css({
    width: 0,
    height: 0,
    borderLeft: `${rem(6)} solid transparent`,
    borderRight: `${rem(6)} solid transparent`,
    ...(direction === 'up'
      ? { borderBottom: `${rem(8)} solid ${fern.rgb}` }
      : { borderTop: `${rem(8)} solid ${ember.rgb}` }),
  });

type BaseProps = {
  label: string;
  value: number;
  caption: string;
};

type EventAttendanceMetricProps = BaseProps &
  ({ variant: 'progress' } | { variant: 'delta'; direction: 'up' | 'down' });

const EventAttendanceMetric: React.FC<EventAttendanceMetricProps> = (props) => {
  const { label, value, caption } = props;

  if (props.variant === 'delta') {
    return (
      <div css={containerStyles}>
        <p css={labelStyles}>{label}</p>
        <div css={deltaRowStyles}>
          <p css={valueStyles}>{value}%</p>
          <span
            css={arrowStyles(props.direction)}
            role="img"
            aria-label={props.direction === 'up' ? 'Increase' : 'Decrease'}
          />
        </div>
        <p css={labelStyles}>{caption}</p>
      </div>
    );
  }

  return (
    <div css={containerStyles}>
      <div css={progressRowStyles}>
        <span css={wheelStyles}>
          <ProgressWheel percentage={value} />
        </span>
        <div>
          <p css={labelStyles}>{label}</p>
          <p css={valueStyles}>{value}%</p>
          <p css={labelStyles}>{caption}</p>
        </div>
      </div>
      <div css={barStyles}>
        <ProgressBar percentage={value} />
      </div>
    </div>
  );
};

export default EventAttendanceMetric;
