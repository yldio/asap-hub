/** @jsxImportSource @emotion/react */
import { Banner } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import EditorButton from './EditorButton';
import {
  NumberField,
  panelHeadingStyles,
  panelStyles,
  SelectField,
  TextField,
} from './fields';
import { TrashIcon } from './icons';

type Props = {
  readonly banner: Banner;
  readonly readOnly: boolean;
  readonly onChange: (change: Partial<Banner>) => void;
  readonly onRemove: () => void;
};

const BannerInspector: FC<Props> = ({
  banner,
  readOnly,
  onChange,
  onRemove,
}) => (
  <aside css={panelStyles} aria-label="Banner">
    <h2 css={panelHeadingStyles}>Banner</h2>

    <TextField
      label="Heading"
      value={banner.text}
      disabled={readOnly}
      placeholder="Attendance"
      onChange={(text) => onChange({ text })}
    />
    <TextField
      label="Subtitle"
      value={banner.subtitle ?? ''}
      disabled={readOnly}
      placeholder="Under feature flag ASAP_NEW_EVENT_PAGE"
      onChange={(subtitle) => onChange({ subtitle })}
    />
    <NumberField
      label="Starts at, in milliseconds"
      value={banner.startMs}
      step={250}
      disabled={readOnly}
      onChange={(startMs) => onChange({ startMs })}
    />
    <NumberField
      label="Length in milliseconds"
      value={banner.durationMs}
      min={200}
      step={250}
      disabled={readOnly}
      onChange={(durationMs) => onChange({ durationMs })}
    />
    <SelectField
      label="Position"
      value={banner.position}
      disabled={readOnly}
      options={[
        { value: 'bottom', label: 'Lower third' },
        { value: 'top', label: 'Upper third' },
      ]}
      onChange={(position) =>
        onChange({ position: position as Banner['position'] })
      }
    />
    <SelectField
      label="Animation"
      value={banner.animation}
      disabled={readOnly}
      options={[
        { value: 'fade', label: 'Fade' },
        { value: 'slide', label: 'Slide' },
      ]}
      onChange={(animation) =>
        onChange({ animation: animation as Banner['animation'] })
      }
    />

    <EditorButton
      danger
      icon={<TrashIcon size={15} />}
      disabled={readOnly}
      onClick={onRemove}
    >
      Remove banner
    </EditorButton>
  </aside>
);

export default BannerInspector;
