/** @jsxImportSource @emotion/react */
import { fern, info500, iris, steel } from '../colors';
import { rem } from '../pixels';
import { clampPercentage } from '../utils';

const findingsRampStops = `${iris.hex} 30.25%, ${info500.hex} 51.91%, #1491B2 66.74%, #299C86 79.82%, ${fern.hex} 90.01%`;

const findingsGradient = `linear-gradient(90deg, ${findingsRampStops})`;

const WHEEL_SIZE = 74;
const WHEEL_STROKE = 9;

// Green sits near 100% then blends back to purple at the seam so the ring loops.
const findingsConicRamp = `conic-gradient(from 0deg, ${findingsRampStops}, ${iris.hex} 100%)`;

const wheelRingMask = `radial-gradient(farthest-side, transparent calc(100% - ${rem(
  WHEEL_STROKE,
)}), #000 calc(100% - ${rem(WHEEL_STROKE)}))`;

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

export const ProgressWheel: React.FC<{ percentage: number }> = ({
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
          background: `conic-gradient(from 0deg, transparent 0 ${value}%, ${steel.rgb} ${value}% 100%), ${findingsConicRamp}`,
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

export const ProgressBar: React.FC<{ percentage: number }> = ({
  percentage,
}) => {
  const value = clampPercentage(percentage);
  return (
    <div
      css={{
        width: '100%',
        height: rem(8),
        borderRadius: rem(4),
        backgroundColor: steel.rgb,
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        css={{
          height: '100%',
          borderRadius: rem(4),
          background: findingsGradient,
          // Reveal only the 0→value slice so the tip colour tracks the value.
          backgroundSize: `${value > 0 ? 10000 / value : 100}% 100%`,
          backgroundRepeat: 'no-repeat',
        }}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
