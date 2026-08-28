/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  chooseCanvas,
  layoutClips,
  placementAt,
  timelineDurationMs,
} from '@asap-hub/demo-timeline';
import {
  FC,
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
import ClipInspector from './ClipInspector';
import { editorTheme } from './editorTheme';
import { clampZoom, defaultPixelsPerSecond } from './geometry';
import PreviewStage from './PreviewStage';
import Timeline from './Timeline';
import TransportBar from './TransportBar';
import { usePlayback } from './usePlayback';

const shellStyles = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 560,
  backgroundColor: editorTheme.surface,
  borderRadius: 10,
  border: `1px solid ${editorTheme.line}`,
  overflow: 'hidden',
  color: editorTheme.text,
});

const bodyStyles = css({
  display: 'flex',
  minHeight: 0,
  '@media (max-width: 1100px)': { flexDirection: 'column' },
});

const centreStyles = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  minWidth: 0,
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
}) => {
  const [selectedClipId, setSelectedClipId] = useState<string>();
  const [pixelsPerSecond, setPixelsPerSecond] = useState(
    defaultPixelsPerSecond,
  );
  const stageRef = useRef<HTMLDivElement>(null);

  const { timeline, dispatch } = editor;
  const placements = useMemo(() => layoutClips(timeline.clips), [timeline]);
  const durationMs = useMemo(
    () => timelineDurationMs(timeline.clips),
    [timeline],
  );
  const { playheadMs, playing, toggle, seek, nudge } = usePlayback({
    durationMs,
  });

  const current = placementAt(placements, playheadMs);
  const selected = placements.find(({ clip }) => clip.id === selectedClipId);
  const selectedSource =
    selected?.clip.kind === 'source' ? selected.clip : undefined;

  const assetsById = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.assetId, asset])),
    [assets],
  );

  const assetDurationOf = useCallback(
    (assetId: string, fallbackMs: number): number =>
      assetsById[assetId]?.durationMs ?? fallbackMs,
    [assetsById],
  );

  const zoomToFit = useCallback(() => {
    const width = stageRef.current?.clientWidth ?? 0;
    if (width === 0 || durationMs === 0) {
      setPixelsPerSecond(defaultPixelsPerSecond);
      return;
    }
    setPixelsPerSecond(clampZoom(((width - 64) / durationMs) * 1000));
  }, [durationMs]);

  // the whole demo should be visible without hunting for the right zoom first
  const fitted = useRef(false);
  useLayoutEffect(() => {
    if (!fitted.current && durationMs > 0) {
      fitted.current = true;
      zoomToFit();
    }
  }, [durationMs, zoomToFit]);

  const addAsset = useCallback(
    (asset: ProjectAsset) => {
      dispatch({
        type: 'addClip',
        assetId: asset.assetId,
        // an asset still being prepared lands at a provisional length that the
        // ingest corrects once it has probed the file
        durationMs: asset.durationMs ?? 10000,
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
    [assetsById, dispatch, timeline.clips],
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
    if (!selected) return;
    dispatch({ type: 'removeClip', clipId: selected.clip.id });
    setSelectedClipId(undefined);
  }, [dispatch, selected]);

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
    <div css={shellStyles}>
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
        <div css={centreStyles} ref={stageRef}>
          <PreviewStage
            placement={current}
            playheadMs={playheadMs}
            playing={playing}
            assets={assetsById}
            assetUrl={assetUrl}
          />
        </div>

        <AssetPanel
          assets={assets}
          busy={uploading}
          progress={uploadProgress}
          readOnly={readOnly}
          onImport={onImport}
          onAdd={addAsset}
          onDelete={onDeleteAsset}
        />

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
        />
      </div>

      <ActionBar
        hasSelection={Boolean(selected)}
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
        selectedClipId={selectedClipId}
        readOnly={readOnly}
        assets={assetsById}
        onSelect={setSelectedClipId}
        onSeek={seek}
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
