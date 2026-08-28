/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  chooseCanvas,
  clipLocalMs,
  resolveChapters,
  layoutClips,
  placementAt,
  timelineDurationMs,
} from '@asap-hub/demo-timeline';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ProjectAsset } from '../../api/types';
import { createId } from '../project/ids';
import { ProjectEditor as Editor } from '../project/useProjectEditor';
import ActionBar from './ActionBar';
import AssetPanel from './AssetPanel';
import BannerInspector from './BannerInspector';
import ChapterList from './ChapterList';
import ClipInspector from './ClipInspector';
import CursorEffectInspector from './CursorEffectInspector';
import TitleCardInspector from './TitleCardInspector';
import ZoomInspector from './ZoomInspector';
import { editorTheme, trackHeaders } from './editorTheme';
import { clampZoom, defaultPixelsPerSecond } from './geometry';
import PreviewStage from './PreviewStage';
import Timeline from './Timeline';
import TransportBar from './TransportBar';
import { useAssetDurations } from './useAssetDurations';
import { useFittedBox } from './useFittedBox';
import { usePlayback } from './usePlayback';

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
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 16,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
});

const saveLabels: Record<string, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'All changes saved',
  error: 'Could not save, retrying on the next edit',
};

type Props = {
  readonly editor: Editor;
  readonly assets: ProjectAsset[];
  readonly readOnly: boolean;
  readonly assetUrl: (asset: ProjectAsset) => string | undefined;
  readonly onImport: (file: File) => void;
  readonly onDeleteAsset: (asset: ProjectAsset) => void;
  readonly uploading: boolean;
  readonly uploadProgress?: number;
  readonly recorder?: ReactNode;
};

const ProjectEditor: FC<Props> = ({
  editor,
  assets,
  readOnly,
  assetUrl,
  onImport,
  onDeleteAsset,
  uploading,
  uploadProgress,
  recorder,
}) => {
  const [selectedClipId, setSelectedClipId] = useState<string>();
  const [selectedBannerId, setSelectedBannerId] = useState<string>();
  const [selectedZoomId, setSelectedZoomId] = useState<string>();
  const [selectedEffectId, setSelectedEffectId] = useState<string>();
  const [pixelsPerSecond, setPixelsPerSecond] = useState(
    defaultPixelsPerSecond,
  );
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [shellWidth, setShellWidth] = useState(0);

  const { timeline, dispatch } = editor;
  const placements = useMemo(() => layoutClips(timeline.clips), [timeline]);
  const durationMs = useMemo(
    () => timelineDurationMs(timeline.clips),
    [timeline],
  );
  const { playheadMs, playing, toggle, seek, nudge } = usePlayback({
    durationMs,
  });
  const previewBox = useFittedBox(
    stageRef,
    timeline.canvas.width / timeline.canvas.height,
  );

  const current = placementAt(placements, playheadMs);
  const selected = placements.find(({ clip }) => clip.id === selectedClipId);
  const selectedBanner = timeline.banners.find(
    ({ id }) => id === selectedBannerId,
  );
  const selectedZoom = timeline.zooms.find(({ id }) => id === selectedZoomId);
  const cursorLayer = timeline.cursor.find(
    (layer) => layer.clipId === current?.clip.id,
  );
  const selectedEffect = cursorLayer?.effects.find(
    ({ id }) => id === selectedEffectId,
  );
  const selectedSource =
    selected?.clip.kind === 'source' ? selected.clip : undefined;

  const assetsById = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.assetId, asset])),
    [assets],
  );

  const probedDurations = useAssetDurations(assets, assetUrl);

  // the server value wins once the ingest has probed the file; until then the
  // browser's own reading keeps the trim bounds honest
  const assetDurationOf = useCallback(
    (assetId: string, fallbackMs: number): number =>
      assetsById[assetId]?.durationMs ?? probedDurations[assetId] ?? fallbackMs,
    [assetsById, probedDurations],
  );

  // the lane starts after the track header gutter, and a little room is left so
  // the last clip does not sit flush against the edge
  const laneWidthOf = (width: number) => width - trackHeaders - 48;

  const zoomToFit = useCallback(() => {
    const lane = laneWidthOf(shellRef.current?.clientWidth ?? shellWidth);
    if (lane <= 0 || durationMs === 0) {
      setPixelsPerSecond(defaultPixelsPerSecond);
      return;
    }
    setPixelsPerSecond(clampZoom((lane / durationMs) * 1000));
  }, [durationMs, shellWidth]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(([entry]) => {
      setShellWidth(entry?.contentRect.width ?? 0);
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  // the whole demo should be visible without hunting for the right zoom first,
  // and the width is only known once the panels have laid out
  const fitted = useRef(false);
  useLayoutEffect(() => {
    if (!fitted.current && durationMs > 0 && laneWidthOf(shellWidth) > 0) {
      fitted.current = true;
      zoomToFit();
    }
  }, [durationMs, shellWidth, zoomToFit]);

  const addAsset = useCallback(
    (asset: ProjectAsset) => {
      dispatch({
        type: 'addClip',
        assetId: asset.assetId,
        // an asset still being prepared lands at a provisional length that the
        // ingest corrects once it has probed the file
        durationMs: asset.durationMs ?? probedDurations[asset.assetId] ?? 10000,
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
    [assetsById, dispatch, probedDurations, timeline.clips],
  );

  const splitAtPlayhead = useCallback(() => {
    if (!current) return;
    dispatch({ type: 'splitAt', tMs: playheadMs, clipId: createId('clip') });
  }, [current, dispatch, playheadMs]);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    dispatch({
      type: 'duplicateClip',
      clipId: selected.clip.id,
      newClipId: createId('clip'),
    });
  }, [dispatch, selected]);

  const toggleMuteSelected = useCallback(() => {
    if (!selected) return;
    dispatch({ type: 'toggleMute', clipId: selected.clip.id });
  }, [dispatch, selected]);

  const removeSelected = useCallback(() => {
    if (selectedEffect && current) {
      dispatch({
        type: 'removeCursorEffect',
        clipId: current.clip.id,
        effectId: selectedEffect.id,
      });
      setSelectedEffectId(undefined);
      return;
    }
    if (selectedZoom) {
      dispatch({ type: 'removeZoom', zoomId: selectedZoom.id });
      setSelectedZoomId(undefined);
      return;
    }
    if (selectedBanner) {
      dispatch({ type: 'removeBanner', bannerId: selectedBanner.id });
      setSelectedBannerId(undefined);
      return;
    }
    if (!selected) return;
    dispatch({ type: 'removeClip', clipId: selected.clip.id });
    setSelectedClipId(undefined);
  }, [
    current,
    dispatch,
    selected,
    selectedBanner,
    selectedEffect,
    selectedZoom,
  ]);

  const selectClip = useCallback((clipId: string) => {
    setSelectedClipId(clipId);
    setSelectedBannerId(undefined);
    setSelectedZoomId(undefined);
  }, []);

  const selectBanner = useCallback((bannerId: string) => {
    setSelectedBannerId(bannerId);
    setSelectedClipId(undefined);
    setSelectedZoomId(undefined);
  }, []);

  const selectZoom = useCallback((zoomId: string) => {
    setSelectedZoomId(zoomId);
    setSelectedClipId(undefined);
    setSelectedBannerId(undefined);
    setSelectedEffectId(undefined);
  }, []);

  const selectEffect = useCallback((effectId: string) => {
    setSelectedEffectId(effectId);
    setSelectedClipId(undefined);
    setSelectedBannerId(undefined);
    setSelectedZoomId(undefined);
  }, []);

  const addTitleCard = useCallback(() => {
    const clipId = createId('title');
    dispatch({
      type: 'addTitleCard',
      clipId,
      index: current ? current.index + 1 : placements.length,
      text: 'New section',
      durationMs: 3000,
    });
    selectClip(clipId);
  }, [current, dispatch, placements.length, selectClip]);

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
    selectZoom(id);
  }, [current, dispatch, playheadMs, selectZoom]);

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
    selectEffect(effectId);
  }, [current, dispatch, playheadMs, selectEffect]);

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
        durationMs: 4000,
        preset: 'lowerThird',
        text: 'New banner',
        position: 'bottom',
        animation: 'fade',
      },
    });
    selectBanner(id);
  }, [dispatch, playheadMs, selectBanner]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const transport: Record<string, () => void> = {
        Space: toggle,
        ArrowLeft: () => nudge(event.shiftKey ? -1000 : -100),
        ArrowRight: () => nudge(event.shiftKey ? 1000 : 100),
      };
      const editing: Record<string, () => void> = {
        KeyS: splitAtPlayhead,
        KeyD: duplicateSelected,
        KeyM: toggleMuteSelected,
        Delete: removeSelected,
        Backspace: removeSelected,
      };

      const move = transport[event.code];
      if (move) {
        event.preventDefault();
        move();
        return;
      }

      const edit = editing[event.code];
      if (edit && !readOnly) {
        edit();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    duplicateSelected,
    nudge,
    readOnly,
    removeSelected,
    splitAtPlayhead,
    toggle,
    toggleMuteSelected,
  ]);

  return (
    <div css={shellStyles} ref={shellRef}>
      <TransportBar
        playing={playing}
        canPlay={durationMs > 0}
        canUndo={!readOnly && editor.canUndo}
        canRedo={!readOnly && editor.canRedo}
        saveLabel={saveLabels[editor.saveState] ?? ''}
        canvasHeight={timeline.canvas.height}
        canvasFps={timeline.canvas.fps}
        onFpsChange={(fps) =>
          dispatch({ type: 'setCanvas', canvas: { ...timeline.canvas, fps } })
        }
        onToggle={toggle}
        onSkipStart={() => seek(0)}
        onSkipEnd={() => seek(durationMs)}
        onUndo={editor.undo}
        onRedo={editor.redo}
      />

      <div css={bodyStyles}>
        <AssetPanel
          recorder={recorder}
          chapters={
            <ChapterList
              resolved={resolveChapters(timeline, { includeUntitled: true })}
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
          onAdd={addAsset}
          onDelete={onDeleteAsset}
        />

        <div css={centreStyles} ref={stageRef}>
          <PreviewStage
            box={previewBox}
            placement={current}
            banners={timeline.banners}
            zooms={timeline.zooms}
            cursorEffects={
              timeline.cursor.find((layer) => layer.clipId === current?.clip.id)
                ?.effects ?? []
            }
            playheadMs={playheadMs}
            playing={playing}
            assets={assetsById}
            assetUrl={assetUrl}
            onPickPoint={
              readOnly
                ? undefined
                : (point) => {
                    if (selectedZoom) {
                      dispatch({
                        type: 'updateZoom',
                        zoomId: selectedZoom.id,
                        change: { focus: point },
                      });
                    } else if (selectedEffect && current) {
                      dispatch({
                        type: 'updateCursorEffect',
                        clipId: current.clip.id,
                        effectId: selectedEffect.id,
                        change: { point },
                      });
                    }
                  }
            }
          />
        </div>

        {selectedEffect && current ? (
          <CursorEffectInspector
            effect={selectedEffect}
            readOnly={readOnly}
            onChange={(change) =>
              dispatch({
                type: 'updateCursorEffect',
                clipId: current.clip.id,
                effectId: selectedEffect.id,
                change,
              })
            }
            onRemove={removeSelected}
          />
        ) : null}

        {!selectedEffect && selectedZoom ? (
          <ZoomInspector
            zoom={selectedZoom}
            readOnly={readOnly}
            onChange={(change) =>
              dispatch({
                type: 'updateZoom',
                zoomId: selectedZoom.id,
                change,
              })
            }
            onRemove={removeSelected}
          />
        ) : null}

        {!selectedEffect && !selectedZoom && selectedBanner ? (
          <BannerInspector
            banner={selectedBanner}
            readOnly={readOnly}
            onChange={(change) =>
              dispatch({
                type: 'updateBanner',
                bannerId: selectedBanner.id,
                change,
              })
            }
            onRemove={removeSelected}
          />
        ) : null}

        {!selectedEffect &&
        !selectedZoom &&
        !selectedBanner &&
        selected?.clip.kind === 'title' ? (
          <TitleCardInspector
            placement={selected}
            clip={selected.clip}
            readOnly={readOnly}
            onChange={(change) =>
              dispatch({
                type: 'updateTitleCard',
                clipId: selected.clip.id,
                ...change,
              })
            }
            onRemove={removeSelected}
          />
        ) : null}

        {!selectedEffect &&
        !selectedZoom &&
        !selectedBanner &&
        selected?.clip.kind !== 'title' ? (
          <ClipInspector
            placement={selected}
            asset={
              selectedSource ? assetsById[selectedSource.assetId] : undefined
            }
            readOnly={readOnly}
            index={selected?.index ?? 0}
            clipCount={placements.length}
            onTrim={(change) => {
              if (!selectedSource) return;
              dispatch({
                type: 'trimClip',
                clipId: selectedSource.id,
                ...change,
                assetDurationMs: assetDurationOf(
                  selectedSource.assetId,
                  selectedSource.outMs,
                ),
              });
            }}
            onVolume={(volume) => {
              if (!selected) return;
              dispatch({
                type: 'setClipVolume',
                clipId: selected.clip.id,
                volume,
              });
            }}
            onMove={(toIndex) => {
              if (!selected) return;
              dispatch({ type: 'moveClip', clipId: selected.clip.id, toIndex });
            }}
            onRemove={removeSelected}
            onTransition={(transition) => {
              if (!selected) return;
              dispatch({
                type: 'setTransition',
                clipId: selected.clip.id,
                transition,
              });
            }}
          />
        ) : null}
      </div>

      <ActionBar
        hasSelection={
          Boolean(selected) ||
          Boolean(selectedBanner) ||
          Boolean(selectedZoom) ||
          Boolean(selectedEffect)
        }
        canAddEffect={Boolean(current)}
        onAddTitleCard={addTitleCard}
        onAddBanner={addBanner}
        onAddZoom={addZoom}
        onAddCursorClick={addCursorClick}
        selectionMuted={selectedSource?.volume === 0}
        readOnly={readOnly}
        playheadMs={playheadMs}
        durationMs={durationMs}
        onSplit={splitAtPlayhead}
        onDuplicate={duplicateSelected}
        onToggleMute={toggleMuteSelected}
        onRemove={removeSelected}
        onZoomIn={() => setPixelsPerSecond((value) => clampZoom(value * 1.5))}
        onZoomOut={() => setPixelsPerSecond((value) => clampZoom(value / 1.5))}
        onZoomFit={zoomToFit}
      />

      <Timeline
        placements={placements}
        durationMs={durationMs}
        playheadMs={playheadMs}
        pixelsPerSecond={pixelsPerSecond}
        banners={timeline.banners}
        narration={timeline.narration}
        zooms={timeline.zooms}
        selectedZoomId={selectedZoomId}
        onSelectZoom={selectZoom}
        cursorLayers={timeline.cursor}
        selectedEffectId={selectedEffectId}
        onSelectEffect={selectEffect}
        selectedClipId={selectedClipId}
        selectedBannerId={selectedBannerId}
        readOnly={readOnly}
        assets={assetsById}
        onSelect={selectClip}
        onSelectBanner={selectBanner}
        onSeek={seek}
        onMoveBanner={(bannerId, change) =>
          dispatch({ type: 'updateBanner', bannerId, change })
        }
        onMove={(clipId, toIndex) =>
          dispatch({ type: 'moveClip', clipId, toIndex })
        }
        onTrim={(clipId, change) => {
          const clip = timeline.clips.find(
            (candidate) => candidate.id === clipId,
          );
          if (!clip || clip.kind !== 'source') return;
          dispatch({
            type: 'trimClip',
            clipId,
            ...change,
            assetDurationMs: assetDurationOf(clip.assetId, clip.outMs),
          });
        }}
        onToggleMute={(clipId) => dispatch({ type: 'toggleMute', clipId })}
      />
    </div>
  );
};

export default ProjectEditor;
