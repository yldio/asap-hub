/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  Banner,
  ClipPlacement,
  CursorLayer,
  NarrationClip,
  Zoom,
} from '@asap-hub/demo-timeline';
import {
  FC,
  memo,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { ProjectAsset } from '../../api/types';
import BannerBlock, { BannerDragKind } from './BannerBlock';
import ClipBlock, { ClipDragKind } from './ClipBlock';
import { editorTheme, trackHeights } from './editorTheme';
import {
  formatDuration,
  lanePaddingPx,
  msToPx,
  pxToMs,
  tickIntervalMs,
} from './geometry';
import { isSelected, Selection } from './selection';

const panelStyles = css({
  backgroundColor: editorTheme.panel,
  borderTop: `1px solid ${editorTheme.line}`,
  color: editorTheme.text,
  display: 'flex',
  // a long demo makes the lane far wider than the window; without this the
  // flex item grows to fit it and drags the whole page sideways
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
});

// the track names stay put while the lanes scroll under them
const headerColumnStyles = css({
  flexShrink: 0,
  width: 116,
  borderRight: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.panel,
  zIndex: 1,
});

const headerCellStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: '0 10px',
  borderBottom: `1px solid ${editorTheme.line}`,
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: editorTheme.muted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const scrollStyles = css({
  flex: 1,
  minWidth: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
});

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

const zoomBlockStyles = css({
  position: 'absolute',
  top: 4,
  bottom: 4,
  borderRadius: 6,
  backgroundColor: editorTheme.zoom,
  color: editorTheme.onZoom,
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  border: '1px solid transparent',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
});

const selectedBlockStyles = css({
  borderColor: editorTheme.selected,
  boxShadow: `0 0 0 1px ${editorTheme.selected}`,
});

const effectMarkerStyles = css({
  position: 'absolute',
  top: 8,
  width: 12,
  height: 12,
  marginLeft: -6,
  borderRadius: '50%',
  border: `2px solid ${editorTheme.panel}`,
  backgroundColor: editorTheme.clipEdge,
  padding: 0,
  cursor: 'pointer',
});

const selectedMarkerStyles = css({
  outline: `2px solid ${editorTheme.selected}`,
});

const audioBlockStyles = css({
  position: 'absolute',
  top: 4,
  bottom: 4,
  borderRadius: 6,
  backgroundColor: editorTheme.audio,
  color: editorTheme.onAudio,
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  border: 0,
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
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

// the shortest block still wide enough to aim a pointer at
const minBlockPx = 18;

type MsAt = (clientX: number) => number;

type StartClipDrag = (
  placement: ClipPlacement,
  kind: ClipDragKind,
  event: ReactPointerEvent<HTMLElement>,
) => void;

type StartBannerDrag = (
  banner: Banner,
  kind: BannerDragKind,
  event: ReactPointerEvent<HTMLElement>,
) => void;

type SelectHandler = (kind: Selection['kind'], id: string) => void;

// Every lane below is memoised: the playhead moves on every animation frame,
// and redrawing the blocks underneath it sixty times a second buys nothing.

const Ruler = memo<{
  readonly durationMs: number;
  readonly pixelsPerSecond: number;
  readonly msAt: MsAt;
  readonly onSeek: (ms: number) => void;
}>(({ durationMs, pixelsPerSecond, msAt, onSeek }) => {
  const interval = tickIntervalMs(pixelsPerSecond);
  const tickCount = Math.max(2, Math.ceil(durationMs / interval) + 1);

  return (
    <div
      css={rulerStyles}
      role="presentation"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onSeek(msAt(event.clientX));
      }}
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
  );
});

const ClipTrack = memo<{
  readonly placements: ClipPlacement[];
  readonly assets: Record<string, ProjectAsset>;
  readonly pixelsPerSecond: number;
  readonly durationMs: number;
  readonly selection?: Selection;
  readonly readOnly: boolean;
  readonly dropIndex?: number;
  readonly onSelect: SelectHandler;
  readonly onDragStart: StartClipDrag;
  readonly onToggleMute: (clipId: string) => void;
}>(
  ({
    placements,
    assets,
    pixelsPerSecond,
    durationMs,
    selection,
    readOnly,
    dropIndex,
    onSelect,
    onDragStart,
    onToggleMute,
  }) => (
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
            selected={isSelected(selection, 'clip', placement.clip.id)}
            readOnly={readOnly}
            onSelect={() => onSelect('clip', placement.clip.id)}
            onDragStart={(kind, event) => onDragStart(placement, kind, event)}
            onToggleMute={() => onToggleMute(placement.clip.id)}
          />
        ))
      )}

      {dropIndex === undefined ? null : (
        <div
          css={dropMarkerStyles}
          style={{
            left: msToPx(
              placements[dropIndex]?.startMs ?? durationMs,
              pixelsPerSecond,
            ),
          }}
        />
      )}
    </div>
  ),
);

const BannerTrack = memo<{
  readonly banners: Banner[];
  readonly pixelsPerSecond: number;
  readonly selection?: Selection;
  readonly readOnly: boolean;
  readonly onSelect: SelectHandler;
  readonly onDragStart: StartBannerDrag;
}>(
  ({
    banners,
    pixelsPerSecond,
    selection,
    readOnly,
    onSelect,
    onDragStart,
  }) => (
    <div css={overlayTrackStyles}>
      {banners.map((banner) => (
        <BannerBlock
          key={banner.id}
          banner={banner}
          left={msToPx(banner.startMs, pixelsPerSecond)}
          width={msToPx(banner.durationMs, pixelsPerSecond)}
          selected={isSelected(selection, 'banner', banner.id)}
          readOnly={readOnly}
          onSelect={() => onSelect('banner', banner.id)}
          onDragStart={(kind, event) => onDragStart(banner, kind, event)}
        />
      ))}
    </div>
  ),
);

// zooms and cursor effects share a lane: both are things done to the clip they
// sit over, rather than clips of their own
const EffectTrack = memo<{
  readonly zooms: Zoom[];
  readonly cursorLayers: CursorLayer[];
  readonly placements: ClipPlacement[];
  readonly pixelsPerSecond: number;
  readonly selection?: Selection;
  readonly onSelect: SelectHandler;
}>(
  ({
    zooms,
    cursorLayers,
    placements,
    pixelsPerSecond,
    selection,
    onSelect,
  }) => {
    const startOf = (clipId: string): number | undefined =>
      placements.find(({ clip }) => clip.id === clipId)?.startMs;

    return (
      <div css={overlayTrackStyles}>
        {zooms.map((zoom) => {
          const clipStartMs = startOf(zoom.clipId);
          if (clipStartMs === undefined) {
            return null;
          }
          const lengthMs = zoom.rampInMs + zoom.holdMs + zoom.rampOutMs;
          return (
            <button
              type="button"
              key={zoom.id}
              css={[
                zoomBlockStyles,
                isSelected(selection, 'zoom', zoom.id) && selectedBlockStyles,
              ]}
              style={{
                left: msToPx(clipStartMs + zoom.startMs, pixelsPerSecond),
                width: Math.max(msToPx(lengthMs, pixelsPerSecond), minBlockPx),
              }}
              onClick={() => onSelect('zoom', zoom.id)}
            >
              {`Zoom ${zoom.scale}x`}
            </button>
          );
        })}

        {cursorLayers.flatMap((layer) => {
          const clipStartMs = startOf(layer.clipId);
          if (clipStartMs === undefined) {
            return [];
          }
          return layer.effects.map((effect) => (
            <button
              type="button"
              key={effect.id}
              aria-label={`${effect.type} effect`}
              css={[
                effectMarkerStyles,
                isSelected(selection, 'effect', effect.id) &&
                  selectedMarkerStyles,
              ]}
              style={{
                left: msToPx(clipStartMs + effect.tMs, pixelsPerSecond),
              }}
              onClick={() => onSelect('effect', effect.id)}
            />
          ));
        })}
      </div>
    );
  },
);

const NarrationTrack = memo<{
  readonly narration: NarrationClip[];
  readonly pixelsPerSecond: number;
}>(({ narration, pixelsPerSecond }) => (
  <div css={overlayTrackStyles}>
    {narration.map((clip) => (
      <span
        key={clip.id}
        css={audioBlockStyles}
        style={{
          left: msToPx(clip.startMs, pixelsPerSecond),
          width: Math.max(
            msToPx(clip.outMs - clip.inMs, pixelsPerSecond),
            minBlockPx,
          ),
        }}
      >
        Voice over
      </span>
    ))}
  </div>
));

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
  readonly narration: NarrationClip[];
  readonly zooms: Zoom[];
  readonly cursorLayers: CursorLayer[];
  readonly selection?: Selection;
  readonly readOnly: boolean;
  readonly assets: Record<string, ProjectAsset>;
  readonly onSelect: SelectHandler;
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
  narration,
  zooms,
  cursorLayers,
  selection,
  readOnly,
  assets,
  onSelect,
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
  const indexAt = (tMs: number): number =>
    placements.filter(
      (placement) => tMs > placement.startMs + placement.durationMs / 2,
    ).length;

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

  const startClipDrag = useCallback<StartClipDrag>((placement, kind, event) => {
    const lane = laneRef.current;
    if (!lane) return;
    lane.setPointerCapture(event.pointerId);
    dragRef.current =
      kind === 'move'
        ? { kind, clipId: placement.clip.id, index: placement.index }
        : { kind, clipId: placement.clip.id };
  }, []);

  const startBannerDrag = useCallback<StartBannerDrag>(
    (banner, kind, event) => {
      const lane = laneRef.current;
      if (!lane) return;
      lane.setPointerCapture(event.pointerId);
      dragRef.current = {
        kind,
        bannerId: banner.id,
        // keep the grab point under the pointer instead of snapping the
        // banner's start to it
        grabOffsetMs: msAt(event.clientX) - banner.startMs,
      };
    },
    [msAt],
  );

  const laneWidth = Math.max(
    msToPx(durationMs, pixelsPerSecond) + lanePaddingPx,
    480,
  );

  return (
    <div css={panelStyles}>
      <div css={headerColumnStyles} aria-hidden="true">
        <div css={headerCellStyles} style={{ height: trackHeights.ruler }} />
        <div css={headerCellStyles} style={{ height: trackHeights.clip }}>
          Clips
        </div>
        <div css={headerCellStyles} style={{ height: trackHeights.lane }}>
          Banners
        </div>
        <div css={headerCellStyles} style={{ height: trackHeights.lane }}>
          Zoom, cursor
        </div>
        <div css={headerCellStyles} style={{ height: trackHeights.lane }}>
          Voice over
        </div>
      </div>

      <div css={scrollStyles}>
        <div
          css={laneStyles}
          style={{ width: laneWidth }}
          ref={laneRef}
          onPointerMove={onLanePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <Ruler
            durationMs={durationMs}
            pixelsPerSecond={pixelsPerSecond}
            msAt={msAt}
            onSeek={onSeek}
          />

          <ClipTrack
            placements={placements}
            assets={assets}
            pixelsPerSecond={pixelsPerSecond}
            durationMs={durationMs}
            selection={selection}
            readOnly={readOnly}
            dropIndex={dropIndex}
            onSelect={onSelect}
            onDragStart={startClipDrag}
            onToggleMute={onToggleMute}
          />

          <BannerTrack
            banners={banners}
            pixelsPerSecond={pixelsPerSecond}
            selection={selection}
            readOnly={readOnly}
            onSelect={onSelect}
            onDragStart={startBannerDrag}
          />

          <EffectTrack
            zooms={zooms}
            cursorLayers={cursorLayers}
            placements={placements}
            pixelsPerSecond={pixelsPerSecond}
            selection={selection}
            onSelect={onSelect}
          />

          <NarrationTrack
            narration={narration}
            pixelsPerSecond={pixelsPerSecond}
          />

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
