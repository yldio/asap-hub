/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  layoutClips,
  placementAt,
  timelineDurationMs,
} from '@asap-hub/demo-timeline';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectAsset } from '../../api/types';
import { Button, Caption } from '../../ui/components';
import { paper, pearl, rem, silver, steel } from '../../ui/theme';
import { createId } from '../project/ids';
import { ProjectEditor as Editor } from '../project/useProjectEditor';
import AssetPanel from './AssetPanel';
import ClipInspector from './ClipInspector';
import { clampZoom, defaultPixelsPerSecond, formatTimecode } from './geometry';
import PreviewStage from './PreviewStage';
import Timeline from './Timeline';
import { usePlayback } from './usePlayback';

const shellStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - ${rem(140)})`,
  minHeight: rem(560),
  backgroundColor: paper.rgb,
  border: `1px solid ${silver.rgb}`,
  borderRadius: rem(8),
  overflow: 'hidden',
});

const bodyStyles = css({
  display: 'flex',
  flex: 1,
  minHeight: 0,
});

const centreStyles = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  padding: rem(16),
  minWidth: 0,
  overflow: 'auto',
});

const transportStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  flexWrap: 'wrap',
});

const toolbarStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(10)} ${rem(16)}`,
  borderBottom: `1px solid ${silver.rgb}`,
  backgroundColor: pearl.rgb,
  flexWrap: 'wrap',
});

const spacerStyles = css({ marginLeft: 'auto' });

const timecodeStyles = css({
  fontVariantNumeric: 'tabular-nums',
  fontSize: rem(14),
  color: steel.rgb,
});

const saveLabels: Record<string, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'All changes saved',
  error: 'Could not save',
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

  const { timeline, dispatch } = editor;
  const placements = useMemo(() => layoutClips(timeline.clips), [timeline]);
  const durationMs = useMemo(
    () => timelineDurationMs(timeline.clips),
    [timeline],
  );
  const playback = usePlayback({ durationMs });
  const { playheadMs, playing, toggle, seek, nudge } = playback;

  const current = placementAt(placements, playheadMs);
  const selected = placements.find(({ clip }) => clip.id === selectedClipId);
  const assetsById = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.assetId, asset])),
    [assets],
  );

  const addAsset = useCallback(
    (asset: ProjectAsset) => {
      dispatch({
        type: 'addClip',
        assetId: asset.assetId,
        // an asset that has not been probed yet still lands on the timeline, at
        // a provisional length the ingest corrects
        durationMs: asset.durationMs ?? 10000,
        clipId: createId('clip'),
      });
    },
    [dispatch],
  );

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
      if (event.code === 'Space') {
        event.preventDefault();
        toggle();
      }
      if (event.key === 'ArrowLeft') {
        nudge(event.shiftKey ? -1000 : -100);
      }
      if (event.key === 'ArrowRight') {
        nudge(event.shiftKey ? 1000 : 100);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nudge, toggle]);

  return (
    <div css={shellStyles}>
      <div css={toolbarStyles}>
        <Button
          small
          disabled={readOnly || !editor.canUndo}
          onClick={editor.undo}
        >
          Undo
        </Button>
        <Button
          small
          disabled={readOnly || !editor.canRedo}
          onClick={editor.redo}
        >
          Redo
        </Button>
        <Button
          small
          disabled={readOnly || !current}
          onClick={() =>
            dispatch({
              type: 'splitAt',
              tMs: playheadMs,
              clipId: createId('clip'),
            })
          }
        >
          Split at playhead
        </Button>
        <span css={spacerStyles} />
        <Caption>{saveLabels[editor.saveState]}</Caption>
      </div>

      <div css={bodyStyles}>
        <AssetPanel
          assets={assets}
          busy={uploading}
          progress={uploadProgress}
          readOnly={readOnly}
          onImport={onImport}
          onAdd={addAsset}
          onDelete={onDeleteAsset}
        />

        <div css={centreStyles}>
          <PreviewStage
            placement={current}
            playheadMs={playheadMs}
            playing={playing}
            assets={assetsById}
            assetUrl={assetUrl}
          />
          <div css={transportStyles}>
            <Button small onClick={toggle} disabled={durationMs === 0}>
              {playing ? 'Pause' : 'Play'}
            </Button>
            <span css={timecodeStyles}>
              {formatTimecode(playheadMs)} / {formatTimecode(durationMs)}
            </span>
            <span css={spacerStyles} />
            <Button
              small
              onClick={() =>
                setPixelsPerSecond((value) => clampZoom(value / 1.5))
              }
            >
              Zoom out
            </Button>
            <Button
              small
              onClick={() =>
                setPixelsPerSecond((value) => clampZoom(value * 1.5))
              }
            >
              Zoom in
            </Button>
          </div>
        </div>

        <ClipInspector
          placement={selected}
          asset={
            selected?.clip.kind === 'source'
              ? assetsById[selected.clip.assetId]
              : undefined
          }
          readOnly={readOnly}
          index={selected?.index ?? 0}
          clipCount={placements.length}
          onTrim={(change) => {
            if (!selected || selected.clip.kind !== 'source') return;
            const asset = assetsById[selected.clip.assetId];
            dispatch({
              type: 'trimClip',
              clipId: selected.clip.id,
              ...change,
              assetDurationMs:
                asset?.durationMs ?? selected.clip.outMs + 60 * 60 * 1000,
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
          onRemove={() => {
            if (!selected) return;
            dispatch({ type: 'removeClip', clipId: selected.clip.id });
            setSelectedClipId(undefined);
          }}
        />
      </div>

      <Timeline
        placements={placements}
        durationMs={durationMs}
        playheadMs={playheadMs}
        pixelsPerSecond={pixelsPerSecond}
        selectedClipId={selectedClipId}
        assets={assetsById}
        onSelect={setSelectedClipId}
        onSeek={seek}
      />
    </div>
  );
};

export default ProjectEditor;
