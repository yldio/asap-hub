/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  Banner,
  clipLocalMs,
  ClipPlacement,
  CursorEffect,
  fadeOpacityAt,
  Point,
  sourceTimeAt,
  Zoom,
} from '@asap-hub/demo-timeline';
import {
  FC,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ProjectAsset } from '../../api/types';
import { rem } from '../../ui/theme';
import BannerLayer, { BannerLayerHandle } from './BannerLayer';
import { editorTheme } from './editorTheme';
import CursorLayer, { CursorLayerHandle } from './CursorLayer';
import { usePlaybackContext, usePlayheadEffect } from './usePlayback';
import { panFocus, pointInBox, ZoomTransform, zoomTransformAt } from './zoom';

// the size is measured and set by the editor, so the frame keeps its ratio
// whichever way the window is constrained
const stageStyles = css({
  containerType: 'inline-size',
  position: 'relative',
  backgroundColor: editorTheme.stage,
  borderRadius: rem(8),
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
});

const grabStyles = css({ cursor: 'grab', ':active': { cursor: 'grabbing' } });
const pinStyles = css({ cursor: 'crosshair' });

const videoStyles = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const emptyStyles = css({
  color: editorTheme.onStage,
  textAlign: 'center',
  padding: rem(24),
});

// the title card is artwork, not chrome: these are the colours the renderer
// burns into the video, so they stay literal in both themes

const titleCardStyles = css({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  backgroundColor: '#0b0d12',
  color: '#ffffff',
  padding: rem(48),
  textAlign: 'center',
});

const titleTextStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(12),
});

const headingStyles = css({
  fontSize: rem(40),
  fontWeight: 700,
  margin: 0,
  lineHeight: 1.15,
});

const subheadingStyles = css({
  fontSize: rem(22),
  margin: 0,
  color: '#d5d5de',
});

const hintStyles = css({
  position: 'absolute',
  left: rem(10),
  bottom: rem(10),
  padding: `${rem(4)} ${rem(10)}`,
  borderRadius: rem(6),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#ffffff',
  fontSize: rem(12),
  pointerEvents: 'none',
});

// the handle that says where a click effect fires, shown whenever one is
// selected so it can be seen and moved without hunting for its 600ms window
const markerStyles = css({
  position: 'absolute',
  width: rem(28),
  height: rem(28),
  marginLeft: rem(-14),
  marginTop: rem(-14),
  borderRadius: '50%',
  border: '2px solid #ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.45)',
  cursor: 'grab',
  padding: 0,
  touchAction: 'none',
  ':active': { cursor: 'grabbing' },
});

export type StagePin = {
  point: Point;
  onChange: (point: Point) => void;
};

export type StageFocus = {
  point: Point;
  scale: number;
  onChange: (point: Point) => void;
};

type Props = {
  readonly box: { width: number; height: number };
  readonly placement?: ClipPlacement;
  readonly banners: Banner[];
  readonly zooms: Zoom[];
  readonly cursorEffects: CursorEffect[];
  // the layer's own nudge, applied here exactly as the render applies it
  readonly cursorOffsetMs?: number;
  readonly playing: boolean;
  readonly volume: number;
  readonly assets: Record<string, ProjectAsset>;
  readonly assetUrl: (asset: ProjectAsset) => string | undefined;
  // set while a zoom is selected: the stage holds that zoom so it can be aimed
  readonly focus?: StageFocus;
  // set while a click effect is selected: its marker can be dropped anywhere
  readonly pin?: StagePin;
  // a drag across the stage is one thing the creator did, not one edit per
  // pointer sample, so it collapses into a single undo step
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
};

// one video element, re-pointed as the playhead crosses a clip boundary. The
// timeline clock owns the time; the element is told where to be, never asked.
const PreviewStage: FC<Props> = ({
  box,
  placement,
  banners,
  zooms,
  cursorEffects,
  cursorOffsetMs,
  playing,
  volume,
  assets,
  assetUrl,
  focus,
  pin,
  onGestureStart,
  onGestureEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<CursorLayerHandle>(null);
  const bannerRef = useRef<BannerLayerHandle>(null);
  const panRef = useRef<{ x: number; y: number; from: Point }>();
  const [panning, setPanning] = useState(false);
  const clip = placement?.clip;
  const asset = clip?.kind === 'source' ? assets[clip.assetId] : undefined;
  const url = asset ? assetUrl(asset) : undefined;

  const playhead = usePlaybackContext();
  const startMs = playhead.getPlayheadMs();
  const localMs = placement ? clipLocalMs(placement, startMs) : 0;

  const transformAt = (atMs: number): ZoomTransform =>
    // aiming a zoom means seeing it, whatever the playhead is over
    focus
      ? { scale: focus.scale, originX: focus.point.x, originY: focus.point.y }
      : zoomTransformAt(zooms, clip?.id ?? '', atMs);

  const zoom = transformAt(localMs);
  // the render pans by moving the crop window; the preview does the same by
  // scaling around the focus point, so the two frame the same thing
  const zoomStyle = {
    transform: `scale(${zoom.scale})`,
    transformOrigin: `${zoom.originX * 100}% ${zoom.originY * 100}%`,
  };

  // every frame of playback is written straight to the DOM: re-rendering the
  // stage sixty times a second is what used to leave the editor no headroom
  usePlayheadEffect((ms) => {
    const atMs = placement ? clipLocalMs(placement, ms) : 0;
    const element = videoRef.current;
    if (element) {
      const frame = transformAt(atMs);
      element.style.transform = `scale(${frame.scale})`;
      element.style.transformOrigin = `${frame.originX * 100}% ${
        frame.originY * 100
      }%`;

      const sourceMs =
        placement && clip?.kind === 'source'
          ? sourceTimeAt(placement, ms)
          : undefined;
      // only correct real drift, otherwise every frame fights the element's own
      // playback and the picture stutters
      if (
        sourceMs !== undefined &&
        Math.abs(element.currentTime - sourceMs / 1000) > 0.25
      ) {
        element.currentTime = sourceMs / 1000;
      }
    }

    const text = titleTextRef.current;
    if (text && clip?.kind === 'title') {
      text.style.opacity = `${fadeOpacityAt(
        clip,
        { startMs: 0, durationMs: clip.durationMs },
        atMs,
      )}`;
    }

    cursorRef.current?.setTime(atMs);
    bannerRef.current?.setTime(ms);
  });

  useEffect(() => {
    const element = videoRef.current;
    if (!element) {
      return;
    }
    if (playing && url) {
      void element.play().catch(() => undefined);
    } else {
      element.pause();
    }
  }, [playing, url]);

  // the clip's own level and the preview slider both apply, the way the render
  // applies the clip's. An element can only be turned down, so a clip pushed
  // above 1 sounds like 1 here and louder in the export.
  const clipVolume = clip?.kind === 'source' ? clip.volume : 1;
  useEffect(() => {
    const element = videoRef.current;
    if (element) {
      element.volume = Math.min(1, Math.max(0, volume * clipVolume));
    }
  }, [clipVolume, volume]);

  const size = { width: box.width, height: box.height };

  if (!clip) {
    return (
      <div css={stageStyles} style={size}>
        <p css={emptyStyles}>Add a clip to the timeline to see it here.</p>
      </div>
    );
  }

  if (clip.kind === 'title') {
    // only the words fade; the card itself is the clip's picture, and the
    // render draws exactly this curve
    const textOpacity = fadeOpacityAt(
      clip,
      { startMs: 0, durationMs: clip.durationMs },
      localMs,
    );
    return (
      <div css={stageStyles} style={size}>
        <div css={titleCardStyles}>
          <div
            ref={titleTextRef}
            css={titleTextStyles}
            style={{ opacity: textOpacity }}
          >
            <h2 css={headingStyles}>{clip.text}</h2>
            {clip.subtitle ? (
              <p css={subheadingStyles}>{clip.subtitle}</p>
            ) : null}
          </div>
        </div>
        <BannerLayer ref={bannerRef} banners={banners} tMs={startMs} />
      </div>
    );
  }

  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!focus) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    panRef.current = { x: event.clientX, y: event.clientY, from: focus.point };
    setPanning(true);
  };

  const movePan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pan = panRef.current;
    if (!pan || !focus) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    focus.onChange(
      panFocus(
        pan.from,
        { dx: event.clientX - pan.x, dy: event.clientY - pan.y },
        bounds,
        focus.scale,
      ),
    );
  };

  const endDrag = () => {
    if (panRef.current || pin) {
      onGestureEnd?.();
    }
    panRef.current = undefined;
    setPanning(false);
  };

  const dropPin = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pin) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pin.onChange(pointInBox(event.clientX, event.clientY, bounds));
  };

  return (
    <div
      css={[stageStyles, focus && grabStyles, pin && pinStyles]}
      style={size}
      onPointerDown={(event) => {
        if (focus) {
          onGestureStart?.();
          startPan(event);
        } else if (pin) {
          onGestureStart?.();
          event.currentTarget.setPointerCapture(event.pointerId);
          dropPin(event);
        }
      }}
      onPointerMove={(event) => {
        if (panRef.current) {
          movePan(event);
        } else if (
          pin &&
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          dropPin(event);
        }
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {url ? (
        <video
          ref={videoRef}
          css={videoStyles}
          style={zoomStyle}
          src={url}
          preload="auto"
          muted={clip.volume === 0}
          playsInline
        />
      ) : (
        <p css={emptyStyles}>
          {asset?.state === 'preparing'
            ? 'This clip is still being prepared.'
            : 'This clip has no playable source yet.'}
        </p>
      )}
      <CursorLayer
        ref={cursorRef}
        effects={cursorEffects}
        tMs={localMs}
        offsetMs={cursorOffsetMs}
      />
      <BannerLayer ref={bannerRef} banners={banners} tMs={startMs} />

      {pin ? (
        <span
          css={markerStyles}
          style={{
            left: `${pin.point.x * 100}%`,
            top: `${pin.point.y * 100}%`,
          }}
          aria-hidden="true"
        />
      ) : null}

      {focus && !panning ? (
        <span css={hintStyles}>Drag the picture to aim the zoom</span>
      ) : null}
      {pin ? (
        <span css={hintStyles}>Click or drag to place the click</span>
      ) : null}
    </div>
  );
};

export default PreviewStage;
