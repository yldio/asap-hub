/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useRef } from 'react';
import { ProjectAsset } from '../../api/types';
import { Button, Caption } from '../../ui/components';
import { pearl, rem, silver, steel } from '../../ui/theme';
import { formatDuration } from './geometry';

const panelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  padding: rem(16),
  borderRight: `1px solid ${silver.rgb}`,
  minWidth: rem(240),
  maxWidth: rem(280),
  overflowY: 'auto',
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
});

const itemStyles = css({
  backgroundColor: pearl.rgb,
  borderRadius: rem(6),
  padding: rem(10),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
});

const labelStyles = css({
  fontSize: rem(13),
  fontWeight: 600,
  wordBreak: 'break-word',
});

const metaStyles = css({
  fontSize: rem(12),
  color: steel.rgb,
});

const hiddenInputStyles = css({ display: 'none' });

const stateLabel: Record<ProjectAsset['state'], string> = {
  uploading: 'Uploading',
  preparing: 'Preparing',
  ready: 'Ready',
  failed: 'Failed',
};

type Props = {
  readonly assets: ProjectAsset[];
  readonly busy: boolean;
  readonly progress?: number;
  readonly readOnly: boolean;
  readonly onImport: (file: File) => void;
  readonly onAdd: (asset: ProjectAsset) => void;
  readonly onDelete: (asset: ProjectAsset) => void;
};

const AssetPanel: FC<Props> = ({
  assets,
  busy,
  progress,
  readOnly,
  onImport,
  onAdd,
  onDelete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <aside css={panelStyles} aria-label="Media">
      <Caption>Media</Caption>
      <input
        ref={inputRef}
        css={hiddenInputStyles}
        type="file"
        accept="video/*"
        aria-label="Import a video"
        onChange={(event) => {
          const input = event.target;
          const file = input.files?.[0];
          if (file) {
            onImport(file);
          }
          // let the same file be picked again straight after
          input.value = '';
        }}
      />
      <Button
        primary
        small
        disabled={readOnly || busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy
          ? `Uploading${progress === undefined ? '' : ` ${progress}%`}`
          : 'Import a video'}
      </Button>

      {assets.length === 0 ? (
        <p css={metaStyles}>
          Nothing here yet. Import a video to start building the demo.
        </p>
      ) : (
        <ul css={listStyles}>
          {assets.map((asset) => (
            <li key={asset.assetId} css={itemStyles}>
              <span css={labelStyles}>{asset.label}</span>
              <span css={metaStyles}>
                {stateLabel[asset.state]}
                {asset.durationMs
                  ? ` · ${formatDuration(asset.durationMs)}`
                  : ''}
              </span>
              <div css={{ display: 'flex', gap: rem(8) }}>
                <Button
                  small
                  disabled={readOnly || asset.state === 'failed'}
                  onClick={() => onAdd(asset)}
                >
                  Add to timeline
                </Button>
                <Button
                  small
                  danger
                  disabled={readOnly}
                  onClick={() => onDelete(asset)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default AssetPanel;
