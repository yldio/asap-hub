/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import {
  CursorEffect,
  CursorPathPoint,
  cursorPointerTrack,
  defaultCursorColor,
  edgeFor,
  isCursorColor,
  pointerBox,
  pointerLayers,
  pointerPositionAt,
  pointerVariant,
} from '@asap-hub/demo-timeline';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  borderStyle: 'solid',
  borderWidth: 2,
  transform: 'translate(-50%, -50%)',
});

const inkOf = (effect: CursorEffect): string =>
  effect.color && isCursorColor(effect.color)
    ? effect.color
    : defaultCursorColor;

// the same edge the render draws just outside the ring, so a white click stays
// readable on the white page it usually sits on, and a black one on a dark app
const edgeShadow = (ink: string): string => {
  const edge = edgeFor(ink);
  const rgb = edge.color === '#ffffff' ? '255, 255, 255' : '0, 0, 0';
  return `0 0 0 2px rgba(${rgb}, ${edge.opacity})`;
};

// The animation is wall clock, and it ends on opacity 0. Parked on an effect to
// place it, the creator saw it flash once and then nothing at all, which is the
// whole time they are actually looking at it. So it only animates while the
// demo is playing; paused, it holds the ring the export burns in.
const playingRippleStyles = css({
  animation: `${ripple} 600ms ease-out forwards`,
});

const spotlightStyles = css({
  position: 'absolute',
  inset: 0,
});

// The holder fills the layer, so a translate in percent of its own size is a
// translate in percent of the frame: the pointer is placed by writing one
// transform, with nothing to measure and no layout to read.
const pointerHolderStyles = css({
  position: 'absolute',
  inset: 0,
  transformOrigin: '0 0',
  willChange: 'transform',
});

// hung off its own hotspot, so the part that points lands on the captured
// position rather than the middle of the sprite
const pointerArtStyles = css({
  position: 'absolute',
  left: 0,
  top: 0,
  overflow: 'visible',
});

// how long a ripple stays on screen; the render burns the same window
export const rippleMs = 600;
export const spotlightMs = 1200;

// the layer's nudge is what lines a capture up with the footage, and the render
// applies it when it places every effect, so the preview has to as well
const visible = (
  effect: CursorEffect,
  tMs: number,
  windowMs: number,
  offsetMs: number,
): boolean => {
  const atMs = effect.tMs + offsetMs;
  return tMs >= atMs && tMs <= atMs + windowMs;
};

const shownAt = (
  effects: CursorEffect[],
  tMs: number,
  offsetMs: number,
): CursorEffect[] =>
  effects.filter((effect) =>
    visible(
      effect,
      tMs,
      effect.type === 'spotlight' ? spotlightMs : rippleMs,
      offsetMs,
    ),
  );

// nothing on this layer changes while an effect is on screen: a ripple is a CSS
// animation and a spotlight stands still, so the only moments worth a render
// are the ones where the set of effects on screen changes
const keyOf = (shown: CursorEffect[]): string =>
  shown.map((effect) => effect.id).join(' ');

export type CursorLayerHandle = {
  setTime: (ms: number) => void;
};

const noPath: CursorPathPoint[] = [];

const pointerTransform = (x: number, y: number): string =>
  `translate(${x * 100}%, ${y * 100}%)`;

type Props = {
  readonly effects: CursorEffect[];
  // the captured path the pointer walks, in the same clip-local time the render
  // reads it in
  readonly path?: CursorPathPoint[];
  // which drawn pointer walks it; the whole capture shares one
  readonly pointer?: string;
  // where the layer starts; the stage drives it from there
  readonly tMs?: number;
  readonly offsetMs?: number;
  readonly playing?: boolean;
};

const CursorLayer = forwardRef<CursorLayerHandle, Props>(
  (
    {
      effects,
      path = noPath,
      pointer: pointerId,
      tMs = 0,
      offsetMs = 0,
      playing = false,
    },
    ref,
  ) => {
    const [timeMs, setTimeMs] = useState(tMs);
    const shown = shownAt(effects, timeMs, offsetMs);
    const shownKey = keyOf(shown);
    const shownKeyRef = useRef(shownKey);
    const pointerRef = useRef<HTMLDivElement>(null);
    const latestMsRef = useRef(tMs);

    // the same simplified track the render walks, so the two draw one path
    const track = useMemo(
      () => cursorPointerTrack({ path, offsetMs }),
      [offsetMs, path],
    );
    const pointer = pointerPositionAt(track, timeMs);
    const variant = useMemo(() => pointerVariant(pointerId), [pointerId]);
    const box = useMemo(() => pointerBox(variant), [variant]);

    useEffect(() => {
      shownKeyRef.current = shownKey;
    }, [shownKey]);

    // the pointer moves every frame, which is exactly what a render sixty times
    // a second used to cost, so its transform is written straight to the node
    const placePointer = useCallback(
      (ms: number) => {
        const node = pointerRef.current;
        if (!node) {
          return;
        }
        const at = pointerPositionAt(track, ms);
        node.style.display = at ? '' : 'none';
        if (at) {
          node.style.transform = pointerTransform(at.x, at.y);
        }
      },
      [track],
    );

    useEffect(() => {
      placePointer(latestMsRef.current);
    }, [placePointer]);

    useImperativeHandle(
      ref,
      () => ({
        setTime: (ms: number) => {
          latestMsRef.current = ms;
          placePointer(ms);
          const key = keyOf(shownAt(effects, ms, offsetMs));
          if (key === shownKeyRef.current) {
            return;
          }
          shownKeyRef.current = key;
          setTimeMs(ms);
        },
      }),
      [effects, offsetMs, placePointer],
    );

    const spotlight = shown.find((effect) => effect.type === 'spotlight');

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

        {shown
          .filter((effect) => effect.type === 'ripple')
          .map((effect) => (
            <span
              key={`${effect.id}-${Math.round(effect.tMs)}-${
                playing ? 'playing' : 'held'
              }`}
              data-testid="cursor-ripple"
              css={[rippleStyles, playing && playingRippleStyles]}
              style={{
                left: `${effect.point.x * 100}%`,
                top: `${effect.point.y * 100}%`,
                borderColor: inkOf(effect),
                backgroundColor: `${inkOf(effect)}2e`,
                boxShadow: edgeShadow(inkOf(effect)),
              }}
            />
          ))}

        {track.length > 0 ? (
          <div
            ref={pointerRef}
            data-testid="cursor-pointer"
            css={pointerHolderStyles}
            style={{
              display: pointer ? undefined : 'none',
              transform: pointer
                ? pointerTransform(pointer.x, pointer.y)
                : undefined,
            }}
          >
            <svg
              css={pointerArtStyles}
              style={{
                height: `${box.heightRatio * 100}%`,
                aspectRatio: `${box.aspectRatio}`,
                transform: `translate(${box.hotspotX * -100}%, ${
                  box.hotspotY * -100
                }%)`,
              }}
              viewBox={box.viewBox}
              preserveAspectRatio="xMinYMin meet"
              aria-hidden="true"
            >
              {pointerLayers(variant).map((layer, index) => (
                <path
                  key={`${index === 0 ? 'edge' : 'ink'}-${layer.d}`}
                  d={layer.d}
                  fillRule={layer.fillRule}
                  fill={layer.fill}
                  fillOpacity={layer.fillOpacity}
                  stroke={layer.stroke}
                  strokeOpacity={layer.strokeOpacity}
                  strokeWidth={layer.strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        ) : null}
      </div>
    );
  },
);

export default CursorLayer;
