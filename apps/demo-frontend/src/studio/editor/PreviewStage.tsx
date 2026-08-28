/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  Banner,
  clipLocalMs,
  ClipPlacement,
  CursorEffect,
  sourceTimeAt,
  Zoom,
} from '@asap-hub/demo-timeline';
import { FC, useEffect, useRef } from 'react';
import { ProjectAsset } from '../../api/types';
import { charcoal, paper, rem, steel } from '../../ui/theme';
import BannerLayer from './BannerLayer';
import CursorLayer from './CursorLayer';
import { zoomTransformAt } from './zoom';

const stageStyles = css({
  containerType: 'inline-size',
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: charcoal.rgb,
  borderRadius: rem(8),
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const videoStyles = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const emptyStyles = css({
  color: paper.rgb,
  textAlign: 'center',
  padding: rem(24),
});

const titleCardStyles = css({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  backgroundColor: charcoal.rgb,
  color: paper.rgb,
  padding: rem(48),
  textAlign: 'center',
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
  color: steel.rgb,
});

type Props = {
  readonly placement?: ClipPlacement;
  readonly banners: Banner[];
  readonly zooms: Zoom[];
  readonly cursorEffects: CursorEffect[];
  readonly playheadMs: number;
  readonly playing: boolean;
  readonly assets: Record<string, ProjectAsset>;
  readonly assetUrl: (asset: ProjectAsset) => string | undefined;
};

// one video element, re-pointed as the playhead crosses a clip boundary. The
// timeline clock owns the time; the element is told where to be, never asked.
const PreviewStage: FC<Props> = ({
  placement,
  banners,
  zooms,
  cursorEffects,
  playheadMs,
  playing,
  assets,
  assetUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip = placement?.clip;
  const asset = clip?.kind === 'source' ? assets[clip.assetId] : undefined;
  const url = asset ? assetUrl(asset) : undefined;

  const localMs = placement ? clipLocalMs(placement, playheadMs) : 0;
  const zoom = zoomTransformAt(zooms, clip?.id ?? '', localMs);
  // the render pans by moving the crop window; the preview does the same by
  // scaling around the focus point, so the two frame the same thing
  const zoomStyle = {
    transform: `scale(${zoom.scale})`,
    transformOrigin: `${zoom.originX * 100}% ${zoom.originY * 100}%`,
  };

  const sourceMs =
    placement && clip?.kind === 'source'
      ? sourceTimeAt(placement, playheadMs)
      : undefined;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || sourceMs === undefined) {
      return;
    }
    const target = sourceMs / 1000;
    // only correct real drift, otherwise every frame fights the element's own
    // playback and the picture stutters
    if (Math.abs(element.currentTime - target) > 0.25) {
      element.currentTime = target;
    }
  }, [sourceMs]);

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

  if (!clip) {
    return (
      <div css={stageStyles}>
        <p css={emptyStyles}>Add a clip to the timeline to see it here.</p>
      </div>
    );
  }

  if (clip.kind === 'title') {
    return (
      <div css={stageStyles}>
        <div css={titleCardStyles}>
          <h2 css={headingStyles}>{clip.text}</h2>
          {clip.subtitle ? <p css={subheadingStyles}>{clip.subtitle}</p> : null}
        </div>
        <BannerLayer banners={banners} tMs={playheadMs} />
      </div>
    );
  }

  return (
    <div css={stageStyles}>
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
      <CursorLayer effects={cursorEffects} tMs={localMs} />
      <BannerLayer banners={banners} tMs={playheadMs} />
    </div>
  );
};

export default PreviewStage;
