/** @jsxImportSource @emotion/react */
import { steel } from '../colors';
import { rem } from '../pixels';
import { clampPercentage } from '../utils';

import { findingsGradient } from './findingsGradient';

type GradientProgressBarProps = {
  percentage: number;
  label?: string;
  height?: number;
  radius?: number;
  gradient?: string;
  // 'track' stretches the ramp across the whole track, so the tip colour tracks
  // the value; 'fill' maps the whole ramp onto the filled portion instead.
  gradientAnchor?: 'track' | 'fill';
};

const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  percentage,
  label,
  height = 8,
  radius = 4,
  gradient = findingsGradient,
  gradientAnchor = 'track',
}) => {
  const value = clampPercentage(percentage);
  return (
    <div
      css={{
        width: '100%',
        height: rem(height),
        borderRadius: rem(radius),
        backgroundColor: steel.rgb,
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        css={{
          height: '100%',
          borderRadius: rem(radius),
          background: gradient,
          ...(gradientAnchor === 'track'
            ? {
                // Reveal only the 0→value slice so the tip colour tracks the
                // value.
                backgroundSize: `${value > 0 ? 10000 / value : 100}% 100%`,
                backgroundRepeat: 'no-repeat' as const,
              }
            : {}),
        }}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default GradientProgressBar;
