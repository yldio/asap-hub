/** @jsxImportSource @emotion/react */
import { Zoom } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import EditorButton from './EditorButton';
import {
  mutedStyles,
  NumberField,
  panelHeadingStyles,
  panelStyles,
  readingStyles,
  SelectField,
} from './fields';
import { formatTimecode } from './geometry';
import { TrashIcon } from './icons';
import { zoomDurationMs } from './zoom';

type Props = {
  readonly zoom: Zoom;
  readonly readOnly: boolean;
  readonly onChange: (change: Partial<Zoom>) => void;
  readonly onRemove: () => void;
};

const ZoomInspector: FC<Props> = ({ zoom, readOnly, onChange, onRemove }) => (
  <aside css={panelStyles} aria-label="Zoom">
    <h2 css={panelHeadingStyles}>Zoom</h2>

    <div css={readingStyles}>
      <span css={mutedStyles}>Length</span>
      <span>{formatTimecode(zoomDurationMs(zoom))}</span>
    </div>

    <SelectField
      label="Scale"
      value={String(zoom.scale)}
      disabled={readOnly}
      options={[
        { value: '1.5', label: '1.5x' },
        { value: '2', label: '2x' },
        { value: '2.5', label: '2.5x' },
        { value: '3', label: '3x' },
      ]}
      onChange={(scale) => onChange({ scale: Number(scale) })}
    />
    <NumberField
      label="Starts in the clip, in milliseconds"
      value={zoom.startMs}
      step={250}
      disabled={readOnly}
      onChange={(startMs) => onChange({ startMs })}
    />
    <NumberField
      label="Ramp in"
      value={zoom.rampInMs}
      step={100}
      disabled={readOnly}
      onChange={(rampInMs) => onChange({ rampInMs })}
    />
    <NumberField
      label="Hold"
      value={zoom.holdMs}
      step={250}
      disabled={readOnly}
      onChange={(holdMs) => onChange({ holdMs })}
    />
    <NumberField
      label="Ramp out"
      value={zoom.rampOutMs}
      step={100}
      disabled={readOnly}
      onChange={(rampOutMs) => onChange({ rampOutMs })}
    />

    <p css={mutedStyles}>
      {`Focus ${Math.round(zoom.focus.x * 100)}% across, ${Math.round(
        zoom.focus.y * 100,
      )}% down. Drag the picture to aim it.`}
    </p>
    <p css={mutedStyles}>
      The preview holds this zoom while it is selected, so what you see is what
      the export frames. Drag either edge of its block to change how long it
      lasts.
    </p>

    <EditorButton
      danger
      icon={<TrashIcon size={15} />}
      disabled={readOnly}
      onClick={onRemove}
    >
      Remove zoom
    </EditorButton>
  </aside>
);

export default ZoomInspector;
