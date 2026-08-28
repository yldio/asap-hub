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
import ClipBlock from './ClipBlock';
import {
  DragKind,
  Span,
  SpanDrag,
  spanAfterDrag,
  TrimDrag,
  trimAfterDrag,
} from './dragging';
import { editorTheme, trackHeaders, trackHeights } from './editorTheme';
import {
  formatDuration,
  lanePaddingPx,
  msToPx,
  pxToMs,
  tickIntervalMs,
} from './geometry';
import LaneBlock from './LaneBlock';
import { isSelected, Selection } from './selection';
import { zoomDurationMs } from './zoom';

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
  width: trackHeaders,
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

type MsAt = (clientX: number) => number;

// a title card has no footage to trim, so both its edges just change how long
// it stays on screen; every other span sits on a lane of its own
export type SpanKind = 'banner' | 'zoom' | 'narration' | 'title';

type StartClipDrag = (
  placement: ClipPlacement,
  kind: DragKind,
  event: ReactPointerEvent<HTMLElement>,
) => void;

type StartSpanDrag = (
  kind: SpanKind,
  id: string,
  span: Span,
  dragKind: DragKind,
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
  readonly onDragStart: StartSpanDrag;
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
        <LaneBlock
          key={banner.id}
          tone="banner"
          label={banner.text || 'Banner'}
          name={`Banner ${banner.text || 'Untitled'}`}
          left={msToPx(banner.startMs, pixelsPerSecond)}
          width={msToPx(banner.durationMs, pixelsPerSecond)}
          selected={isSelected(selection, 'banner', banner.id)}
          readOnly={readOnly}
          onSelect={() => onSelect('banner', banner.id)}
          onDragStart={(kind, event) =>
            onDragStart('banner', banner.id, banner, kind, event)
          }
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
  readonly readOnly: boolean;
  readonly onSelect: SelectHandler;
  readonly onDragStart: StartSpanDrag;
}>(
  ({
    zooms,
    cursorLayers,
    placements,
    pixelsPerSecond,
    selection,
    readOnly,
    onSelect,
    onDragStart,
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
          const span = {
            startMs: clipStartMs + zoom.startMs,
            durationMs: zoomDurationMs(zoom),
          };
          return (
            <LaneBlock
              key={zoom.id}
              tone="zoom"
              label={`Zoom ${zoom.scale}x`}
              name={`Zoom ${zoom.scale}x`}
              left={msToPx(span.startMs, pixelsPerSecond)}
              width={msToPx(span.durationMs, pixelsPerSecond)}
              selected={isSelected(selection, 'zoom', zoom.id)}
              readOnly={readOnly}
              onSelect={() => onSelect('zoom', zoom.id)}
              onDragStart={(kind, event) =>
                onDragStart('zoom', zoom.id, span, kind, event)
              }
            />
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
  readonly assets: Record<string, ProjectAsset>;
  readonly pixelsPerSecond: number;
  readonly selection?: Selection;
  readonly readOnly: boolean;
  readonly onSelect: SelectHandler;
  readonly onDragStart: StartSpanDrag;
}>(
  ({
    narration,
    assets,
    pixelsPerSecond,
    selection,
    readOnly,
    onSelect,
    onDragStart,
  }) => (
    <div css={overlayTrackStyles}>
      {narration.length === 0 ? (
        <p css={emptyTrackStyles}>
          Record a voice over or import an audio file to add one here.
        </p>
      ) : (
        narration.map((take) => {
          const label = assets[take.assetId]?.label ?? 'Voice over';
          const span = {
            startMs: take.startMs,
            durationMs: take.outMs - take.inMs,
          };
          return (
            <LaneBlock
              key={take.id}
              tone="audio"
              label={label}
              name={`Voice over ${label}`}
              left={msToPx(span.startMs, pixelsPerSecond)}
              width={msToPx(span.durationMs, pixelsPerSecond)}
              selected={isSelected(selection, 'narration', take.id)}
              readOnly={readOnly}
              onSelect={() => onSelect('narration', take.id)}
              onDragStart={(kind, event) =>
                onDragStart('narration', take.id, span, kind, event)
              }
            />
          );
        })
      )}
    </div>
  ),
);

type Drag =
  | { target: 'reorder'; clipId: string; index: number }
  | ({ target: 'clip'; clipId: string } & TrimDrag)
  | ({ target: 'span'; spanKind: SpanKind; id: string } & SpanDrag);

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
  // always in programme time; the editor converts for the clip-anchored tracks.
  // The drag kind travels with it because moving a block and resizing it mean
  // different things to the audio underneath it.
  readonly onSpanChange: (
    kind: SpanKind,
    id: string,
    span: Span,
    drag: DragKind,
  ) => void;
  readonly onMove: (clipId: string, toIndex: number) => void;
  readonly onTrim: (
    clipId: string,
    change: { inMs?: number; outMs?: number },
  ) => void;
  readonly onToggleMute: (clipId: string) => void;
  // one drag is one undoable step, however many pointer moves it takes
  readonly onGestureStart: () => void;
  readonly onGestureEnd: () => void;
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
  onSpanChange,
  onToggleMute,
  onGestureStart,
  onGestureEnd,
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
    // a capture can be lost without a pointerup ever reaching the lane, and a
    // stale drag would then keep editing on plain hover
    if (!drag || readOnly || event.buttons === 0) return;
    const tMs = msAt(event.clientX);

    switch (drag.target) {
      case 'reorder':
        setDropIndex(indexAt(tMs));
        return;

      case 'clip':
        onTrim(drag.clipId, trimAfterDrag(drag, tMs));
        return;

      default:
        onSpanChange(
          drag.spanKind,
          drag.id,
          spanAfterDrag(drag, tMs),
          drag.kind,
        );
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = undefined;
    if (drag) {
      onGestureEnd();
    }

    if (drag?.target === 'reorder' && dropIndex !== undefined) {
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

  // the lane owns the pointer for the whole drag, so it keeps receiving moves
  // even once the pointer has left the block it started on
  const capture = useCallback(
    (event: ReactPointerEvent<HTMLElement>): boolean => {
      const lane = laneRef.current;
      if (!lane) return false;
      lane.setPointerCapture(event.pointerId);
      return true;
    },
    [],
  );

  const startClipDrag = useCallback<StartClipDrag>(
    (placement, kind, event) => {
      if (!capture(event)) return;
      onGestureStart();
      const { clip } = placement;

      if (kind === 'move') {
        dragRef.current = {
          target: 'reorder',
          clipId: clip.id,
          index: placement.index,
        };
        return;
      }

      dragRef.current =
        clip.kind === 'source'
          ? {
              target: 'clip',
              clipId: clip.id,
              kind,
              originMs: msAt(event.clientX),
              inMs: clip.inMs,
              outMs: clip.outMs,
            }
          : {
              target: 'span',
              spanKind: 'title',
              id: clip.id,
              kind,
              originMs: msAt(event.clientX),
              startMs: placement.startMs,
              durationMs: placement.durationMs,
            };
    },
    [capture, msAt, onGestureStart],
  );

  const startSpanDrag = useCallback<StartSpanDrag>(
    (spanKind, id, span, kind, event) => {
      if (!capture(event)) return;
      onGestureStart();
      dragRef.current = {
        target: 'span',
        spanKind,
        id,
        kind,
        originMs: msAt(event.clientX),
        ...span,
      };
    },
    [capture, msAt, onGestureStart],
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
          onLostPointerCapture={endDrag}
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
            onDragStart={startSpanDrag}
          />

          <EffectTrack
            zooms={zooms}
            cursorLayers={cursorLayers}
            placements={placements}
            pixelsPerSecond={pixelsPerSecond}
            selection={selection}
            readOnly={readOnly}
            onSelect={onSelect}
            onDragStart={startSpanDrag}
          />

          <NarrationTrack
            narration={narration}
            assets={assets}
            pixelsPerSecond={pixelsPerSecond}
            selection={selection}
            readOnly={readOnly}
            onSelect={onSelect}
            onDragStart={startSpanDrag}
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
