import { css } from '@emotion/react';

import { GradientProgressBar, GradientProgressWheel } from '../atoms';
import { ember, fern } from '../colors';
import { rem } from '../pixels';

import {
  metricBarStyles,
  metricContainerStyles,
  metricLabelStyles,
  metricProgressRowStyles,
  metricValueStyles,
  metricWheelStyles,
} from './shared-metric-card-styles';

const deltaRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const arrowContainerStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(32),
  height: rem(32),
});

const arrowStyles = (direction: 'up' | 'down') =>
  css({
    width: 0,
    height: 0,
    borderLeft: `${rem(7)} solid transparent`,
    borderRight: `${rem(7)} solid transparent`,
    ...(direction === 'up'
      ? { borderBottom: `${rem(10)} solid ${fern.rgb}` }
      : { borderTop: `${rem(10)} solid ${ember.rgb}` }),
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
      <div css={metricContainerStyles}>
        <p css={metricLabelStyles}>{label}</p>
        <div css={deltaRowStyles}>
          <p css={metricValueStyles}>
            {`${props.direction === 'up' ? '+' : '-'} ${value}`}
          </p>
          <span
            css={arrowContainerStyles}
            role="img"
            aria-label={props.direction === 'up' ? 'Increase' : 'Decrease'}
          >
            <span css={arrowStyles(props.direction)} />
          </span>
        </div>
        <p css={metricLabelStyles}>{caption}</p>
      </div>
    );
  }

  return (
    <div css={metricContainerStyles}>
      <div css={metricProgressRowStyles}>
        <span css={metricWheelStyles}>
          <GradientProgressWheel percentage={value} />
        </span>
        <div>
          <p css={metricLabelStyles}>{label}</p>
          <p css={metricValueStyles}>{value}%</p>
          <p css={metricLabelStyles}>{caption}</p>
        </div>
      </div>
      <div css={metricBarStyles}>
        <GradientProgressBar percentage={value} />
      </div>
    </div>
  );
};

export default EventAttendanceMetric;
