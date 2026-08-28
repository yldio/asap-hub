/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NarrationClip } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import { ProjectAsset } from '../../api/types';
import EditorButton from './EditorButton';
import {
  fieldStyles,
  mutedStyles,
  TimecodeField,
  panelHeadingStyles,
  panelStyles,
  readingStyles,
} from './fields';
import { formatTimecode } from './geometry';
import { TrashIcon } from './icons';

const rangeStyles = css({ width: '100%' });

type Props = {
  readonly narration: NarrationClip;
  readonly asset?: ProjectAsset;
  readonly readOnly: boolean;
  readonly onChange: (change: Partial<NarrationClip>) => void;
  readonly onRemove: () => void;
};

const NarrationInspector: FC<Props> = ({
  narration,
  asset,
  readOnly,
  onChange,
  onRemove,
}) => (
  <aside css={panelStyles} aria-label="Voice over">
    <h2 css={panelHeadingStyles}>Voice over</h2>

    <div css={readingStyles}>
      <span css={mutedStyles}>Track</span>
      <span>{asset?.label ?? 'Recorded audio'}</span>
    </div>
    <div css={readingStyles}>
      <span css={mutedStyles}>Length</span>
      <span>{formatTimecode(narration.outMs - narration.inMs)}</span>
    </div>

    <TimecodeField
      label="Starts at"
      value={narration.startMs}
      disabled={readOnly}
      onChange={(startMs) => onChange({ startMs })}
    />
    <TimecodeField
      label="Skip from the beginning of the audio"
      value={narration.inMs}
      disabled={readOnly}
      onChange={(inMs) => onChange({ inMs })}
    />
    <TimecodeField
      label="Play up to, in the audio"
      value={narration.outMs}
      disabled={readOnly}
      onChange={(outMs) => onChange({ outMs })}
    />

    <label css={fieldStyles}>
      {`Volume ${Math.round(narration.volume * 100)}%`}
      <input
        css={rangeStyles}
        type="range"
        min={0}
        max={2}
        step={0.05}
        disabled={readOnly}
        value={narration.volume}
        onChange={(event) => onChange({ volume: Number(event.target.value) })}
      />
    </label>

    <p css={mutedStyles}>
      Drag it along the voice over lane to line it up, or drag either edge to
      change how much of the recording is used.
    </p>

    <EditorButton
      danger
      icon={<TrashIcon size={15} />}
      disabled={readOnly}
      onClick={onRemove}
    >
      Remove this voice over
    </EditorButton>
  </aside>
);

export default NarrationInspector;
