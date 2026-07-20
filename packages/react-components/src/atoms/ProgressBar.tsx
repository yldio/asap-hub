import { css } from '@emotion/react';

import { fern, steel } from '../colors';
import { rem } from '../pixels';
import { clampPercentage } from '../utils';

const trackStyles = (trackColor: string) =>
  css({
    width: '100%',
    height: rem(8),
    borderRadius: rem(4),
    backgroundColor: trackColor,
    overflow: 'hidden',
  });

const fillStyles = (color: string) =>
  css({
    height: '100%',
    borderRadius: rem(4),
    backgroundColor: color,
  });

type ProgressBarProps = {
  percentage: number;
  color?: string;
  trackColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = fern.rgb,
  trackColor = steel.rgb,
}) => {
  const value = clampPercentage(percentage);
  return (
    <div
      css={trackStyles(trackColor)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div css={fillStyles(color)} style={{ width: `${value}%` }} />
    </div>
  );
};

export default ProgressBar;
