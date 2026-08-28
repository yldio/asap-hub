/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { CursorEffect } from '@asap-hub/demo-timeline';
import { FC } from 'react';

const layerStyles = css({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

const ripple = keyframes({
  from: { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0.85 },
  to: { transform: 'translate(-50%, -50%) scale(2.2)', opacity: 0 },
});

const rippleStyles = css({
  position: 'absolute',
  width: '9%',
  aspectRatio: '1',
  borderRadius: '50%',
  border: '2px solid rgba(255, 255, 255, 0.9)',
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  animation: `${ripple} 600ms ease-out forwards`,
});

const spotlightStyles = css({
  position: 'absolute',
  inset: 0,
});

// how long a ripple stays on screen; the render burns the same window
export const rippleMs = 600;
export const spotlightMs = 1200;

const visible = (
  effect: CursorEffect,
  tMs: number,
  windowMs: number,
): boolean => tMs >= effect.tMs && tMs <= effect.tMs + windowMs;

type Props = {
  readonly effects: CursorEffect[];
  readonly tMs: number;
};

const CursorLayer: FC<Props> = ({ effects, tMs }) => {
  const spotlight = effects.find(
    (effect) =>
      effect.type === 'spotlight' && visible(effect, tMs, spotlightMs),
  );

  return (
    <div css={layerStyles}>
      {spotlight ? (
        <div
          css={spotlightStyles}
          style={{
            background: `radial-gradient(circle at ${
              spotlight.point.x * 100
            }% ${
              spotlight.point.y * 100
            }%, rgba(0, 0, 0, 0) 8%, rgba(0, 0, 0, 0.55) 26%)`,
          }}
        />
      ) : null}

      {effects
        .filter(
          (effect) =>
            effect.type === 'ripple' && visible(effect, tMs, rippleMs),
        )
        .map((effect) => (
          <span
            key={`${effect.id}-${Math.round(effect.tMs)}`}
            css={rippleStyles}
            style={{
              left: `${effect.point.x * 100}%`,
              top: `${effect.point.y * 100}%`,
            }}
          />
        ))}
    </div>
  );
};

export default CursorLayer;
