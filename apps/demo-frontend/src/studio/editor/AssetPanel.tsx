/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, ReactNode, memo, useRef } from 'react';
import { ProjectAsset } from '../../api/types';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import { formatDuration } from './geometry';
import { AudioIcon, PlusIcon, TrashIcon } from './icons';

const panelStyles = css({
  gridColumn: 1,
  gridRow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderRight: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.panel,
  width: 280,
  flexShrink: 0,
  overflowY: 'auto',
  '@media (max-width: 1100px)': {
    width: 'auto',
    borderRight: 0,
    gridColumn: 1,
  },
});

const headingStyles = css({
  margin: 0,
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: editorTheme.muted,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const itemStyles = css({
  backgroundColor: editorTheme.raised,
  border: `1px solid ${editorTheme.line}`,
  borderRadius: 8,
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const labelStyles = css({
  fontSize: 13,
  fontWeight: 600,
  wordBreak: 'break-word',
});

const metaStyles = css({
  fontSize: 12,
  color: editorTheme.muted,
  fontVariantNumeric: 'tabular-nums',
});

const emptyStyles = css({
  fontSize: 13,
  color: editorTheme.muted,
  margin: 0,
  lineHeight: 1.5,
});

const errorStyles = css({ fontSize: 12, color: editorTheme.record });

const rowStyles = css({ display: 'flex', gap: 6 });

const hiddenInputStyles = css({ display: 'none' });

const stateLabel: Record<ProjectAsset['state'], string> = {
  uploading: 'Uploading',
  preparing: 'Preparing',
  ready: 'Ready',
  failed: 'Failed',
};

type Props = {
  readonly assets: ProjectAsset[];
  readonly recorder?: ReactNode;
  readonly chapters?: ReactNode;
  readonly busy: boolean;
  readonly progress?: number;
  readonly readOnly: boolean;
  readonly onImport: (file: File) => void;
  readonly onImportAudio: (file: File) => void;
  readonly onAdd: (asset: ProjectAsset) => void;
  readonly onDelete: (asset: ProjectAsset) => void;
};

const AssetPanel: FC<Props> = ({
  assets,
  recorder,
  chapters,
  busy,
  progress,
  readOnly,
  onImport,
  onImportAudio,
  onAdd,
  onDelete,
}) => {
  const videoRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const pick =
    (handle: (file: File) => void) => (event: { target: HTMLInputElement }) => {
      const input = event.target;
      const file = input.files?.[0];
      if (file) {
        handle(file);
      }
      // let the same file be picked again straight after
      input.value = '';
    };

  return (
    <aside css={panelStyles} aria-label="Media">
      <h2 css={headingStyles}>Media</h2>
      {recorder}
      <input
        ref={videoRef}
        css={hiddenInputStyles}
        type="file"
        accept="video/*"
        aria-label="Import a video"
        onChange={pick(onImport)}
      />
      <input
        ref={audioRef}
        css={hiddenInputStyles}
        type="file"
        accept="audio/*"
        aria-label="Import an audio file"
        onChange={pick(onImportAudio)}
      />
      <EditorButton
        primary
        icon={<PlusIcon size={15} />}
        disabled={readOnly || busy}
        onClick={() => videoRef.current?.click()}
      >
        {busy
          ? `Uploading${progress === undefined ? '' : ` ${progress}%`}`
          : 'Import a video'}
      </EditorButton>
      <EditorButton
        icon={<AudioIcon size={15} />}
        disabled={readOnly || busy}
        onClick={() => audioRef.current?.click()}
      >
        Import audio
      </EditorButton>

      <h2 css={headingStyles}>Chapters</h2>
      {chapters}

      <h2 css={headingStyles}>Clips</h2>
      {assets.length === 0 ? (
        <p css={emptyStyles}>
          Nothing here yet. Import a video, then add it to the timeline to start
          building the demo.
        </p>
      ) : (
        <ul css={listStyles}>
          {assets.map((asset) => (
            <li key={asset.assetId} css={itemStyles}>
              <span css={labelStyles}>{asset.label}</span>
              <span css={metaStyles}>
                {asset.kind === 'audio' ? 'Audio · ' : ''}
                {stateLabel[asset.state]}
                {asset.durationMs
                  ? ` · ${formatDuration(asset.durationMs)}`
                  : ''}
              </span>
              {asset.error ? (
                <span css={errorStyles}>{asset.error}</span>
              ) : null}
              <div css={rowStyles}>
                <EditorButton
                  disabled={readOnly || asset.state === 'failed'}
                  onClick={() => onAdd(asset)}
                >
                  {asset.kind === 'audio'
                    ? 'Add as voice over'
                    : 'Add to timeline'}
                </EditorButton>
                <EditorButton
                  aria-label={`Remove ${asset.label}`}
                  icon={<TrashIcon size={15} />}
                  disabled={readOnly}
                  onClick={() => onDelete(asset)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

// the playhead re-renders the editor on every frame; these panels only ever
// change when the document or the selection does
export default memo(AssetPanel);
