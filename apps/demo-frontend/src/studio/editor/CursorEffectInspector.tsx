/** @jsxImportSource @emotion/react */
import { CursorEffect } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import EditorButton from './EditorButton';
import {
  mutedStyles,
  NumberField,
  panelHeadingStyles,
  panelStyles,
  SelectField,
} from './fields';
import { TrashIcon } from './icons';

const originLabels: Record<CursorEffect['origin'], string> = {
  derived: 'From the captured recording',
  'derived-edited': 'Captured, then edited here',
  manual: 'Placed by hand',
};

type Props = {
  readonly effect: CursorEffect;
  readonly readOnly: boolean;
  readonly onChange: (change: Partial<CursorEffect>) => void;
  readonly onRemove: () => void;
};

const CursorEffectInspector: FC<Props> = ({
  effect,
  readOnly,
  onChange,
  onRemove,
}) => (
  <aside css={panelStyles} aria-label="Cursor effect">
    <h2 css={panelHeadingStyles}>Cursor effect</h2>

    <SelectField
      label="Type"
      value={effect.type}
      disabled={readOnly}
      options={[
        { value: 'ripple', label: 'Click highlight' },
        { value: 'spotlight', label: 'Spotlight' },
      ]}
      onChange={(type) => onChange({ type: type as CursorEffect['type'] })}
    />
    <NumberField
      label="At, in the clip, in milliseconds"
      value={effect.tMs}
      step={100}
      disabled={readOnly}
      onChange={(tMs) => onChange({ tMs })}
    />

    <p css={mutedStyles}>
      {`Placed ${Math.round(effect.point.x * 100)}% across, ${Math.round(
        effect.point.y * 100,
      )}% down. Drag its ring on the preview to move it.`}
    </p>
    <p css={mutedStyles}>
      It plays for about half a second as the playhead reaches it, and its dot
      on the zoom and cursor lane is what you click to find it again.
    </p>
    <p css={mutedStyles}>{originLabels[effect.origin]}</p>

    <EditorButton
      danger
      icon={<TrashIcon size={15} />}
      disabled={readOnly}
      onClick={onRemove}
    >
      Remove effect
    </EditorButton>
  </aside>
);

export default CursorEffectInspector;
