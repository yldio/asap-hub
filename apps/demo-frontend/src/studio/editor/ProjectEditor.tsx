/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  chooseCanvas,
  clipLocalMs,
  CursorEffect,
  Point,
  resolveChapters,
  layoutClips,
  placementAt,
  timelineDurationMs,
} from '@asap-hub/demo-timeline';
import { FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { ProjectAsset } from '../../api/types';
import { createId } from '../project/ids';
import {
  ProjectEditor as Editor,
  SaveState,
} from '../project/useProjectEditor';
import ActionBar from './ActionBar';
import AssetPanel from './AssetPanel';
import ChapterList from './ChapterList';
import { DragKind, Span } from './dragging';
import { editorTheme } from './editorTheme';
import InspectorPanel from './InspectorPanel';
import PreviewStage from './PreviewStage';
import { hasResolvedSelection, resolveSelection, Selection } from './selection';
import { narrationChange, zoomChange } from './spanChange';
import StageControls from './StageControls';
import Timeline, { SpanKind } from './Timeline';
import TransportBar from './TransportBar';
import { useAssetDurations } from './useAssetDurations';
import { useEditorShortcuts } from './useEditorShortcuts';
import { useFittedBox } from './useFittedBox';
import { useFullscreen } from './useFullscreen';
import { usePlayback } from './usePlayback';
import { useTimelineZoom } from './useTimelineZoom';

const shellStyles = css({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  // the timeline scrolls inside itself; nothing here may widen the page
  overflow: 'hidden',
  backgroundColor: editorTheme.surface,
  color: editorTheme.text,
});

// an explicit grid, not flex: the centre column is minmax(0, 1fr) so a wide
// preview or timeline can never push the side panels off the screen
const bodyStyles = css({
  display: 'grid',
  gridTemplateColumns: '280px minmax(0, 1fr) 260px',
  gridTemplateRows: 'minmax(0, 1fr)',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  '@media (max-width: 1100px)': {
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: 'auto',
    flex: 'none',
    overflow: 'auto',
  },
});

// the stage takes whatever the panels and the timeline leave, and the preview
// is centred in it rather than stretched
const centreStyles = css({
  gridColumn: 2,
  gridRow: 1,
  '@media (max-width: 1100px)': { gridColumn: 1 },
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: editorTheme.surface,
});

const stageAreaStyles = css({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const saveLabels: Record<SaveState, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'All changes saved',
  error: 'Could not save, retrying on the next edit',
};

// the playhead moves on every animation frame, so anything handed down as a
// prop has to keep its identity when the document has not changed
const noCursorEffects: CursorEffect[] = [];

const newBannerMs = 4000;
const newTitleCardMs = 3000;
// a provisional length for an asset the ingest has not probed yet
const unknownAssetMs = 10000;

type Props = {
  readonly editor: Editor;
  readonly assets: ProjectAsset[];
  readonly readOnly: boolean;
  readonly assetUrl: (asset: ProjectAsset) => string | undefined;
  readonly onImport: (file: File) => void;
  readonly onImportAudio: (file: File) => void;
  readonly onDeleteAsset: (asset: ProjectAsset) => void;
  readonly uploading: boolean;
  readonly uploadProgress?: number;
  // a recorder needs to put what it captured on the timeline where the playhead
  // is, and the playhead lives here, so it is handed the same drop-in the
  // media list uses rather than reaching for the reducer itself
  readonly recorder?: (addAsset: (asset: ProjectAsset) => void) => ReactNode;
};

const ProjectEditor: FC<Props> = ({
  editor,
  assets,
  readOnly,
  assetUrl,
  onImport,
  onImportAudio,
  onDeleteAsset,
  uploading,
  uploadProgress,
  recorder,
}) => {
  const { timeline, dispatch } = editor;
  const [selection, setSelection] = useState<Selection>();
  const [volume, setVolume] = useState(1);
  const select = useCallback(
    (kind: Selection['kind'], id: string) => setSelection({ kind, id }),
    [],
  );

  const placements = useMemo(
    () => layoutClips(timeline.clips),
    [timeline.clips],
  );
  const durationMs = useMemo(
    () => timelineDurationMs(timeline.clips),
    [timeline.clips],
  );
  const assetsById = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.assetId, asset])),
    [assets],
  );

  const { playheadMs, playing, toggle, seek, nudge } = usePlayback({
    durationMs,
  });
  const zoom = useTimelineZoom(durationMs);
  const stage = useFittedBox(timeline.canvas.width / timeline.canvas.height);
  const theatreRef = useRef<HTMLDivElement>(null);
  const fullscreen = useFullscreen(theatreRef);

  const current = placementAt(placements, playheadMs);
  const selected = useMemo(
    () => resolveSelection(selection, timeline, placements, current),
    [current, placements, selection, timeline],
  );
  const selectedSource =
    selected.clip?.clip.kind === 'source' ? selected.clip.clip : undefined;
  const cursorEffects =
    timeline.cursor.find((layer) => layer.clipId === current?.clip.id)
      ?.effects ?? noCursorEffects;

  const probedDurations = useAssetDurations(assets, assetUrl);

  // the server value wins once the ingest has probed the file; until then the
  // browser's own reading stands in, and a recording that carries no duration
  // at all leaves this undefined rather than pretending the clip is the asset
  const assetDurationOf = useCallback(
    (assetId: string): number | undefined =>
      assetsById[assetId]?.durationMs ?? probedDurations[assetId],
    [assetsById, probedDurations],
  );

  const addNarration = useCallback(
    (asset: ProjectAsset) => {
      const id = createId('narration');
      dispatch({
        type: 'addNarration',
        narration: {
          id,
          assetId: asset.assetId,
          startMs: Math.round(playheadMs),
          inMs: 0,
          outMs: Math.round(
            asset.durationMs ??
              probedDurations[asset.assetId] ??
              unknownAssetMs,
          ),
          volume: 1,
        },
      });
      select('narration', id);
    },
    [dispatch, playheadMs, probedDurations, select],
  );

  const addAsset = useCallback(
    (asset: ProjectAsset) => {
      if (asset.kind === 'audio') {
        addNarration(asset);
        return;
      }
      dispatch({
        type: 'addClip',
        assetId: asset.assetId,
        durationMs:
          asset.durationMs ?? probedDurations[asset.assetId] ?? unknownAssetMs,
        clipId: createId('clip'),
      });
      // the output follows the footage: 60fps sources render at 60, and a
      // source taller than 1080p keeps its height
      dispatch({
        type: 'setCanvas',
        canvas: chooseCanvas([
          ...timeline.clips.flatMap((clip) => {
            const used =
              clip.kind === 'source' ? assetsById[clip.assetId] : undefined;
            return used ? [used] : [];
          }),
          asset,
        ]),
      });
    },
    [addNarration, assetsById, dispatch, probedDurations, timeline.clips],
  );

  const splitAtPlayhead = useCallback(() => {
    if (!current) return;
    dispatch({ type: 'splitAt', tMs: playheadMs, clipId: createId('clip') });
  }, [current, dispatch, playheadMs]);

  const duplicateSelected = useCallback(() => {
    if (!selected.clip) return;
    dispatch({
      type: 'duplicateClip',
      clipId: selected.clip.clip.id,
      newClipId: createId('clip'),
    });
  }, [dispatch, selected.clip]);

  const toggleMuteSelected = useCallback(() => {
    if (!selected.clip) return;
    dispatch({ type: 'toggleMute', clipId: selected.clip.clip.id });
  }, [dispatch, selected.clip]);

  const removeSelected = useCallback(() => {
    if (selected.effect && current) {
      dispatch({
        type: 'removeCursorEffect',
        clipId: current.clip.id,
        effectId: selected.effect.id,
      });
    } else if (selected.zoom) {
      dispatch({ type: 'removeZoom', zoomId: selected.zoom.id });
    } else if (selected.banner) {
      dispatch({ type: 'removeBanner', bannerId: selected.banner.id });
    } else if (selected.narration) {
      dispatch({
        type: 'removeNarration',
        narrationId: selected.narration.id,
      });
    } else if (selected.clip) {
      dispatch({ type: 'removeClip', clipId: selected.clip.clip.id });
    } else {
      return;
    }
    setSelection(undefined);
  }, [current, dispatch, selected]);

  const addTitleCard = useCallback(() => {
    const clipId = createId('title');
    dispatch({
      type: 'addTitleCard',
      clipId,
      index: current ? current.index + 1 : placements.length,
      text: 'New section',
      durationMs: newTitleCardMs,
    });
    select('clip', clipId);
  }, [current, dispatch, placements.length, select]);

  // a zoom belongs to the clip under the playhead and starts where the playhead
  // is, so it lands where the creator is actually looking
  const addZoom = useCallback(() => {
    if (!current) return;
    const id = createId('zoom');
    dispatch({
      type: 'addZoom',
      zoom: {
        id,
        clipId: current.clip.id,
        startMs: Math.round(clipLocalMs(current, playheadMs)),
        rampInMs: 400,
        holdMs: 1500,
        rampOutMs: 400,
        focus: { x: 0.5, y: 0.5 },
        scale: 2,
        easing: 'easeInOut',
      },
    });
    select('zoom', id);
  }, [current, dispatch, playheadMs, select]);

  const addCursorClick = useCallback(() => {
    if (!current) return;
    const effectId = createId('effect');
    dispatch({
      type: 'addCursorEffect',
      clipId: current.clip.id,
      effect: {
        id: effectId,
        tMs: Math.round(clipLocalMs(current, playheadMs)),
        type: 'ripple',
        point: { x: 0.5, y: 0.5 },
        origin: 'manual',
      },
    });
    select('effect', effectId);
  }, [current, dispatch, playheadMs, select]);

  const addChapter = useCallback(() => {
    if (!current) return;
    dispatch({
      type: 'addChapter',
      id: createId('chapter'),
      clipId: current.clip.id,
      offsetMs: Math.round(clipLocalMs(current, playheadMs)),
      title: 'New chapter',
    });
  }, [current, dispatch, playheadMs]);

  const addBanner = useCallback(() => {
    const id = createId('banner');
    dispatch({
      type: 'addBanner',
      banner: {
        id,
        startMs: Math.round(playheadMs),
        durationMs: newBannerMs,
        preset: 'lowerThird',
        text: 'New banner',
        position: 'bottom',
        animation: 'fade',
      },
    });
    select('banner', id);
  }, [dispatch, playheadMs, select]);

  const moveClip = useCallback(
    (clipId: string, toIndex: number) =>
      dispatch({ type: 'moveClip', clipId, toIndex }),
    [dispatch],
  );

  const trimClip = useCallback(
    (clipId: string, change: { inMs?: number; outMs?: number }) => {
      const clip = timeline.clips.find((candidate) => candidate.id === clipId);
      if (!clip || clip.kind !== 'source') return;
      dispatch({
        type: 'trimClip',
        clipId,
        ...change,
        assetDurationMs: assetDurationOf(clip.assetId),
      });
    },
    [assetDurationOf, dispatch, timeline.clips],
  );

  // The timeline speaks programme time for everything it drags. Only the zoom
  // lane is anchored to a clip, so this is the one place that converts.
  const changeSpan = useCallback(
    (kind: SpanKind, id: string, span: Span, drag: DragKind) => {
      const startMs = Math.round(span.startMs);
      const spanDurationMs = Math.round(span.durationMs);

      if (kind === 'banner') {
        dispatch({
          type: 'updateBanner',
          bannerId: id,
          change: { startMs, durationMs: spanDurationMs },
        });
        return;
      }

      if (kind === 'title') {
        dispatch({
          type: 'updateTitleCard',
          clipId: id,
          durationMs: spanDurationMs,
        });
        return;
      }

      if (kind === 'narration') {
        const take = timeline.narration.find((item) => item.id === id);
        if (!take) return;
        dispatch({
          type: 'updateNarration',
          narrationId: id,
          change: narrationChange(
            take,
            span,
            drag,
            assetDurationOf(take.assetId),
          ),
        });
        return;
      }

      const target = timeline.zooms.find((item) => item.id === id);
      const placement = placements.find(
        ({ clip }) => clip.id === target?.clipId,
      );
      if (!target || !placement) return;
      dispatch({
        type: 'updateZoom',
        zoomId: id,
        change: zoomChange(target, span, placement.startMs),
      });
    },
    [assetDurationOf, dispatch, placements, timeline.narration, timeline.zooms],
  );

  const toggleMuteClip = useCallback(
    (clipId: string) => dispatch({ type: 'toggleMute', clipId }),
    [dispatch],
  );

  const moveFocus = useCallback(
    (focus: Point) => {
      if (!selected.zoom) return;
      dispatch({
        type: 'updateZoom',
        zoomId: selected.zoom.id,
        change: { focus },
      });
    },
    [dispatch, selected.zoom],
  );

  const movePin = useCallback(
    (point: Point) => {
      if (!selected.effect || !current) return;
      dispatch({
        type: 'updateCursorEffect',
        clipId: current.clip.id,
        effectId: selected.effect.id,
        change: { point },
      });
    },
    [current, dispatch, selected.effect],
  );

  const chapters = useMemo(
    () => resolveChapters(timeline, { includeUntitled: true }),
    [timeline],
  );
  const recorderPanels = useMemo(
    () => recorder?.(addAsset),
    [addAsset, recorder],
  );

  useEditorShortcuts({
    readOnly,
    onToggle: toggle,
    onNudge: nudge,
    onSplit: splitAtPlayhead,
    onDuplicate: duplicateSelected,
    onToggleMute: toggleMuteSelected,
    onRemove: removeSelected,
    onUndo: editor.undo,
    onRedo: editor.redo,
  });

  return (
    <div css={shellStyles} ref={zoom.shellRef}>
      <TransportBar
        canUndo={!readOnly && editor.canUndo}
        canRedo={!readOnly && editor.canRedo}
        saveLabel={saveLabels[editor.saveState]}
        canvasHeight={timeline.canvas.height}
        canvasFps={timeline.canvas.fps}
        onFpsChange={(fps) =>
          dispatch({ type: 'setCanvas', canvas: { ...timeline.canvas, fps } })
        }
        onUndo={editor.undo}
        onRedo={editor.redo}
      />

      <div css={bodyStyles}>
        <AssetPanel
          recorder={recorderPanels}
          chapters={
            <ChapterList
              resolved={chapters}
              readOnly={readOnly}
              canAdd={Boolean(current)}
              onAdd={addChapter}
              onRename={(chapterId, title) =>
                dispatch({ type: 'updateChapter', chapterId, title })
              }
              onRemove={(chapterId) =>
                dispatch({ type: 'removeChapter', chapterId })
              }
            />
          }
          assets={assets}
          busy={uploading}
          progress={uploadProgress}
          readOnly={readOnly}
          onImport={onImport}
          onImportAudio={onImportAudio}
          onAdd={addAsset}
          onDelete={onDeleteAsset}
        />

        <div css={centreStyles} ref={theatreRef}>
          <div css={stageAreaStyles} ref={stage.ref}>
            <PreviewStage
              box={stage.box}
              placement={current}
              banners={timeline.banners}
              zooms={timeline.zooms}
              cursorEffects={cursorEffects}
              playheadMs={playheadMs}
              playing={playing}
              volume={volume}
              assets={assetsById}
              assetUrl={assetUrl}
              focus={
                selected.zoom && !readOnly
                  ? {
                      point: selected.zoom.focus,
                      scale: selected.zoom.scale,
                      onChange: moveFocus,
                    }
                  : undefined
              }
              pin={
                selected.effect && !readOnly
                  ? { point: selected.effect.point, onChange: movePin }
                  : undefined
              }
            />
          </div>
          <StageControls
            playing={playing}
            canPlay={durationMs > 0}
            playheadMs={playheadMs}
            durationMs={durationMs}
            volume={volume}
            fullscreen={fullscreen.supported ? fullscreen : undefined}
            onToggle={toggle}
            onSeek={seek}
            onSkipStart={() => seek(0)}
            onSkipEnd={() => seek(durationMs)}
            onVolume={setVolume}
          />
        </div>

        <InspectorPanel
          selected={selected}
          current={current}
          assets={assetsById}
          clipCount={placements.length}
          readOnly={readOnly}
          assetDurationOf={assetDurationOf}
          dispatch={dispatch}
          onRemove={removeSelected}
        />
      </div>

      <ActionBar
        hasSelection={hasResolvedSelection(selected)}
        canAddEffect={Boolean(current)}
        onAddTitleCard={addTitleCard}
        onAddBanner={addBanner}
        onAddZoom={addZoom}
        onAddCursorClick={addCursorClick}
        selectionMuted={selectedSource?.volume === 0}
        readOnly={readOnly}
        onSplit={splitAtPlayhead}
        onDuplicate={duplicateSelected}
        onToggleMute={toggleMuteSelected}
        onRemove={removeSelected}
        onZoomIn={zoom.zoomIn}
        onZoomOut={zoom.zoomOut}
        onZoomFit={zoom.zoomToFit}
      />

      <Timeline
        placements={placements}
        durationMs={durationMs}
        playheadMs={playheadMs}
        pixelsPerSecond={zoom.pixelsPerSecond}
        banners={timeline.banners}
        narration={timeline.narration}
        zooms={timeline.zooms}
        cursorLayers={timeline.cursor}
        selection={selection}
        readOnly={readOnly}
        assets={assetsById}
        onSelect={select}
        onSeek={seek}
        onSpanChange={changeSpan}
        onMove={moveClip}
        onTrim={trimClip}
        onToggleMute={toggleMuteClip}
        onGestureStart={editor.beginGesture}
        onGestureEnd={editor.endGesture}
      />
    </div>
  );
};

export default ProjectEditor;
