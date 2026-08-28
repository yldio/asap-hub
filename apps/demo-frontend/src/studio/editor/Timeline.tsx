/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Banner, ClipPlacement } from '@asap-hub/demo-timeline';
import {
  FC,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { ProjectAsset } from '../../api/types';
import BannerBlock, { BannerDragKind } from './BannerBlock';
import ClipBlock, { ClipDragKind } from './ClipBlock';
import { editorTheme, trackHeights } from './editorTheme';
import { formatDuration, msToPx, pxToMs, tickIntervalMs } from './geometry';

const panelStyles = css({
  backgroundColor: editorTheme.panel,
  borderTop: `1px solid ${editorTheme.line}`,
  color: editorTheme.text,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const scrollStyles = css({ overflowX: 'auto', overflowY: 'hidden' });

const laneStyles = css({ position: 'relative', minWidth: '100%' });

const rulerStyles = css({
  position: 'relative',
  height: trackHeights.ruler,
  borderBottom: `1px solid ${editorTheme.line}`,
  cursor: 'pointer',
  touchAction: 'none',
});

const tickStyles = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  borderLeft: `1px solid ${editorTheme.line}`,
  paddingLeft: 4,
  fontSize: 11,
  lineHeight: `${trackHeights.ruler}px`,
  color: editorTheme.muted,
  userSelect: 'none',
  fontVariantNumeric: 'tabular-nums',
});

const trackStyles = css({
  position: 'relative',
  height: trackHeights.clip,
  backgroundColor: editorTheme.track,
  borderBottom: `1px solid ${editorTheme.line}`,
});

const overlayTrackStyles = css({
  position: 'relative',
  height: trackHeights.lane,
  backgroundColor: editorTheme.panel,
  borderBottom: `1px solid ${editorTheme.line}`,
});

const laneLabelStyles = css({
  position: 'absolute',
  left: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: editorTheme.muted,
  pointerEvents: 'none',
});

const emptyTrackStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: editorTheme.muted,
  fontSize: 13,
  height: '100%',
  margin: 0,
});

const playheadStyles = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 2,
  marginLeft: -1,
  backgroundColor: editorTheme.playhead,
  pointerEvents: 'none',
  zIndex: 2,
});

const playheadKnobStyles = css({
  position: 'absolute',
  top: 0,
  left: -5,
  width: 12,
  height: 12,
  borderRadius: '0 0 6px 6px',
  backgroundColor: editorTheme.playhead,
});

const dropMarkerStyles = css({
  position: 'absolute',
  top: 4,
  bottom: 4,
  width: 3,
  marginLeft: -1,
  borderRadius: 2,
  backgroundColor: editorTheme.selected,
  pointerEvents: 'none',
  zIndex: 3,
});

type Drag =
  | { kind: 'move'; clipId: string; index: number }
  | { kind: 'trimStart' | 'trimEnd'; clipId: string }
  | { kind: BannerDragKind; bannerId: string; grabOffsetMs: number };

type Props = {
  readonly placements: ClipPlacement[];
  readonly durationMs: number;
  readonly playheadMs: number;
  readonly pixelsPerSecond: number;
  readonly banners: Banner[];
  readonly selectedClipId?: string;
  readonly selectedBannerId?: string;
  readonly readOnly: boolean;
  readonly assets: Record<string, ProjectAsset>;
  readonly onSelect: (clipId: string) => void;
  readonly onSelectBanner: (bannerId: string) => void;
  readonly onSeek: (ms: number) => void;
  readonly onMoveBanner: (
    bannerId: string,
    change: { startMs?: number; durationMs?: number },
  ) => void;
  readonly onMove: (clipId: string, toIndex: number) => void;
  readonly onTrim: (
    clipId: string,
    change: { inMs?: number; outMs?: number },
  ) => void;
  readonly onToggleMute: (clipId: string) => void;
};

const Timeline: FC<Props> = ({
  placements,
  durationMs,
  playheadMs,
  pixelsPerSecond,
  banners,
  selectedClipId,
  selectedBannerId,
  readOnly,
  assets,
  onSelect,
  onSelectBanner,
  onSeek,
  onMove,
  onTrim,
  onMoveBanner,
  onToggleMute,
}) => {
  const laneRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag>();
  const [dropIndex, setDropIndex] = useState<number>();

  const msAt = useCallback(
    (clientX: number): number => {
      const lane = laneRef.current;
      if (!lane) return 0;
      return pxToMs(
        clientX - lane.getBoundingClientRect().left,
        pixelsPerSecond,
      );
    },
    [pixelsPerSecond],
  );

  // the drop lands before the first clip whose midpoint the pointer has not passed
  const indexAt = useCallback(
    (tMs: number): number =>
      placements.filter(
        (placement) => tMs > placement.startMs + placement.durationMs / 2,
      ).length,
    [placements],
  );

  const onLanePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const tMs = msAt(event.clientX);

    if ('bannerId' in drag) {
      const banner = banners.find(({ id }) => id === drag.bannerId);
      if (!banner) return;
      if (drag.kind === 'move') {
        onMoveBanner(drag.bannerId, {
          startMs: Math.max(0, tMs - drag.grabOffsetMs),
        });
      } else if (drag.kind === 'trimStart') {
        const startMs = Math.max(
          0,
          Math.min(tMs, banner.startMs + banner.durationMs - 200),
        );
        onMoveBanner(drag.bannerId, {
          startMs,
          durationMs: banner.startMs + banner.durationMs - startMs,
        });
      } else {
        onMoveBanner(drag.bannerId, {
          durationMs: Math.max(200, tMs - banner.startMs),
        });
      }
      return;
    }

    if (drag.kind === 'move') {
      setDropIndex(indexAt(tMs));
      return;
    }

    const placement = placements.find(({ clip }) => clip.id === drag.clipId);
    if (!placement || placement.clip.kind !== 'source') return;

    if (drag.kind === 'trimStart') {
      onTrim(drag.clipId, {
        inMs: placement.clip.inMs + (tMs - placement.startMs),
      });
    } else {
      onTrim(drag.clipId, {
        outMs:
          placement.clip.outMs +
          (tMs - (placement.startMs + placement.durationMs)),
      });
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = undefined;

    if (
      drag &&
      !('bannerId' in drag) &&
      drag.kind === 'move' &&
      dropIndex !== undefined
    ) {
      const toIndex = dropIndex > drag.index ? dropIndex - 1 : dropIndex;
      if (toIndex !== drag.index) {
        onMove(drag.clipId, toIndex);
      }
    }

    setDropIndex(undefined);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const startClipDrag = (
    placement: ClipPlacement,
    kind: ClipDragKind,
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    const lane = laneRef.current;
    if (!lane) return;
    lane.setPointerCapture(event.pointerId);
    dragRef.current =
      kind === 'move'
        ? { kind, clipId: placement.clip.id, index: placement.index }
        : { kind, clipId: placement.clip.id };
  };

  const startBannerDrag = (
    banner: Banner,
    kind: BannerDragKind,
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    const lane = laneRef.current;
    if (!lane) return;
    lane.setPointerCapture(event.pointerId);
    dragRef.current = {
      kind,
      bannerId: banner.id,
      // keep the grab point under the pointer instead of snapping the banner's
      // start to it
      grabOffsetMs: msAt(event.clientX) - banner.startMs,
    };
  };

  const scrub = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(msAt(event.clientX));
  };

  const interval = tickIntervalMs(pixelsPerSecond);
  const tickCount = Math.max(2, Math.ceil(durationMs / interval) + 1);
  const laneWidth = Math.max(msToPx(durationMs, pixelsPerSecond) + 48, 480);
  const dropAt = dropIndex === undefined ? undefined : placements[dropIndex];

  return (
    <div css={panelStyles}>
      <div css={scrollStyles}>
        <div
          css={laneStyles}
          style={{ width: laneWidth }}
          ref={laneRef}
          onPointerMove={onLanePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            css={rulerStyles}
            role="presentation"
            onPointerDown={scrub}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                onSeek(msAt(event.clientX));
              }
            }}
          >
            {Array.from({ length: tickCount }, (unused, index) => (
              <span
                key={index}
                css={tickStyles}
                style={{ left: msToPx(index * interval, pixelsPerSecond) }}
              >
                {formatDuration(index * interval)}
              </span>
            ))}
          </div>

          <div css={trackStyles}>
            {placements.length === 0 ? (
              <p css={emptyTrackStyles}>
                Import a video, then add it here to start the demo.
              </p>
            ) : (
              placements.map((placement) => (
                <ClipBlock
                  key={placement.clip.id}
                  placement={placement}
                  asset={
                    placement.clip.kind === 'source'
                      ? assets[placement.clip.assetId]
                      : undefined
                  }
                  left={msToPx(placement.startMs, pixelsPerSecond)}
                  width={msToPx(placement.durationMs, pixelsPerSecond)}
                  selected={placement.clip.id === selectedClipId}
                  readOnly={readOnly}
                  onSelect={() => onSelect(placement.clip.id)}
                  onDragStart={(kind, event) =>
                    startClipDrag(placement, kind, event)
                  }
                  onToggleMute={() => onToggleMute(placement.clip.id)}
                />
              ))
            )}

            {dropIndex === undefined ? null : (
              <div
                css={dropMarkerStyles}
                style={{
                  left: msToPx(dropAt?.startMs ?? durationMs, pixelsPerSecond),
                }}
              />
            )}
          </div>

          <div css={overlayTrackStyles}>
            {banners.length === 0 ? (
              <span css={laneLabelStyles}>Banners</span>
            ) : (
              banners.map((banner) => (
                <BannerBlock
                  key={banner.id}
                  banner={banner}
                  left={msToPx(banner.startMs, pixelsPerSecond)}
                  width={msToPx(banner.durationMs, pixelsPerSecond)}
                  selected={banner.id === selectedBannerId}
                  readOnly={readOnly}
                  onSelect={() => onSelectBanner(banner.id)}
                  onDragStart={(kind, event) =>
                    startBannerDrag(banner, kind, event)
                  }
                />
              ))
            )}
          </div>

          <div
            css={playheadStyles}
            style={{ left: msToPx(playheadMs, pixelsPerSecond) }}
          >
            <span css={playheadKnobStyles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
