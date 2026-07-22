/** @jsxImportSource @emotion/react */
import { steel } from '../colors';
import { rem } from '../pixels';
import { clampPercentage } from '../utils';

import { findingsConicRamp } from './findingsGradient';

const WHEEL_SIZE = 74;
const WHEEL_STROKE = 9;
// Sub-pixel offset between paired colour stops so hard gradient edges get a
// tiny blur band and antialias instead of showing a jagged spoke/ring.
// https://codepen.io/mandymichael/pen/oNNdKzW
const EDGE_BLUR = 0.6;

const wheelRingMask = `radial-gradient(farthest-side, transparent calc(100% - ${rem(
  WHEEL_STROKE,
)}), #000 calc(100% - ${rem(WHEEL_STROKE)} + ${EDGE_BLUR}px))`;

const WHEEL_MID_RADIUS = (WHEEL_SIZE - WHEEL_STROKE) / 2;

// The same conic clipped to a dot at a ring fraction, so the cap colour matches.
const capStyles = (fraction: number) => {
  const angle = fraction * 2 * Math.PI;
  const x = WHEEL_SIZE / 2 + WHEEL_MID_RADIUS * Math.sin(angle);
  const y = WHEEL_SIZE / 2 - WHEEL_MID_RADIUS * Math.cos(angle);
  return {
    position: 'absolute' as const,
    inset: 0,
    background: findingsConicRamp,
    clipPath: `circle(${rem(WHEEL_STROKE / 2)} at ${rem(x)} ${rem(y)})`,
  };
};

type GradientProgressWheelProps = {
  percentage: number;
};

const GradientProgressWheel: React.FC<GradientProgressWheelProps> = ({
  percentage,
}) => {
  const value = clampPercentage(percentage);
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      css={{
        position: 'relative',
        width: rem(WHEEL_SIZE),
        height: rem(WHEEL_SIZE),
      }}
    >
      <div
        css={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, transparent 0 ${value}%, ${
            steel.rgb
          } ${value + EDGE_BLUR}% 100%), ${findingsConicRamp}`,
          WebkitMaskImage: wheelRingMask,
          maskImage: wheelRingMask,
        }}
      />
      {value > 0 && (
        <>
          <div css={capStyles(0)} />
          <div css={capStyles(value / 100)} />
        </>
      )}
    </div>
  );
};

export default GradientProgressWheel;
