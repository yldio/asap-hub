/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Clip, ClipPlacement, Transition } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import { ProjectAsset } from '../../api/types';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import {
  fieldStyles,
  mutedStyles,
  NumberField,
  panelHeadingStyles,
  panelStyles,
  readingStyles,
  SelectField,
} from './fields';
import { formatTimecode } from './geometry';
import { TrashIcon } from './icons';

const nameStyles = css({ fontSize: 14, fontWeight: 600 });

const rangeStyles = css({ accentColor: editorTheme.playhead });

const rowButtonsStyles = css({ display: 'flex', gap: 6 });

type Props = {
  readonly placement?: ClipPlacement;
  readonly asset?: ProjectAsset;
  readonly readOnly: boolean;
  readonly index: number;
  readonly clipCount: number;
  readonly onTrim: (change: { inMs?: number; outMs?: number }) => void;
  readonly onVolume: (volume: number) => void;
  readonly onMove: (toIndex: number) => void;
  readonly onRemove: () => void;
  readonly onTransition: (transition?: Transition) => void;
};

const transitionOptions = [
  { value: 'cut', label: 'Cut' },
  { value: 'crossfade', label: 'Crossfade' },
  { value: 'slide', label: 'Slide' },
];

const defaultTransitionMs = 500;

const clipName = (clip: Clip, asset?: ProjectAsset): string =>
  clip.kind === 'title' ? clip.text || 'Title card' : asset?.label ?? 'Clip';

const ClipInspector: FC<Props> = ({
  placement,
  asset,
  readOnly,
  index,
  clipCount,
  onTrim,
  onVolume,
  onMove,
  onRemove,
  onTransition,
}) => {
  if (!placement) {
    return (
      <aside css={panelStyles} aria-label="Clip">
        <h2 css={panelHeadingStyles}>Clip</h2>
        <p css={mutedStyles}>Select a clip on the timeline to edit it.</p>
      </aside>
    );
  }

  const { clip } = placement;
  const source = clip.kind === 'source' ? clip : undefined;

  return (
    <aside css={panelStyles} aria-label="Clip">
      <h2 css={panelHeadingStyles}>Clip</h2>
      <span css={nameStyles}>{clipName(clip, asset)}</span>

      <div css={readingStyles}>
        <span css={mutedStyles}>Starts</span>
        <span>{formatTimecode(placement.startMs)}</span>
      </div>
      <div css={readingStyles}>
        <span css={mutedStyles}>Length</span>
        <span>{formatTimecode(placement.durationMs)}</span>
      </div>

      {source ? (
        <>
          <NumberField
            label="Trim start"
            value={source.inMs}
            disabled={readOnly}
            onChange={(inMs) => onTrim({ inMs })}
          />
          <NumberField
            label="Trim end"
            value={source.outMs}
            disabled={readOnly}
            onChange={(outMs) => onTrim({ outMs })}
          />
          <label css={fieldStyles}>
            {`Volume ${Math.round(source.volume * 100)}%`}
            <input
              css={rangeStyles}
              type="range"
              min={0}
              max={2}
              step={0.05}
              disabled={readOnly}
              value={source.volume}
              onChange={(event) => onVolume(Number(event.target.value))}
            />
          </label>
        </>
      ) : null}

      {index > 0 ? (
        <SelectField
          label="Transition from the clip before"
          value={clip.transitionIn?.type ?? 'cut'}
          disabled={readOnly}
          options={transitionOptions}
          onChange={(type) =>
            onTransition(
              type === 'cut'
                ? undefined
                : {
                    type: type as Transition['type'],
                    durationMs:
                      clip.transitionIn?.durationMs ?? defaultTransitionMs,
                  },
            )
          }
        />
      ) : null}

      <div css={rowButtonsStyles}>
        <EditorButton
          disabled={readOnly || index === 0}
          onClick={() => onMove(index - 1)}
        >
          Move earlier
        </EditorButton>
        <EditorButton
          disabled={readOnly || index >= clipCount - 1}
          onClick={() => onMove(index + 1)}
        >
          Move later
        </EditorButton>
      </div>

      <EditorButton
        danger
        icon={<TrashIcon size={15} />}
        disabled={readOnly}
        onClick={onRemove}
      >
        Remove clip
      </EditorButton>
    </aside>
  );
};

export default ClipInspector;
