/** @jsxImportSource @emotion/react */
import { Banner, defaultFadeMs } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import EditorButton from './EditorButton';
import {
  FadeField,
  TimecodeField,
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
  <aside css={panelStyles} aria-label="Banner" tabIndex={0}>
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
    <TimecodeField
      label="Starts at"
      value={banner.startMs}
      disabled={readOnly}
      onChange={(startMs) => onChange({ startMs })}
    />
    <TimecodeField
      label="Length"
      value={banner.durationMs}
      disabled={readOnly}
      minMs={200}
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

    <FadeField
      label="Text fades in over"
      value={banner.fadeInMs ?? defaultFadeMs}
      disabled={readOnly}
      onChange={(fadeInMs) => onChange({ fadeInMs })}
    />
    <FadeField
      label="Text fades out over"
      value={banner.fadeOutMs ?? defaultFadeMs}
      disabled={readOnly}
      onChange={(fadeOutMs) => onChange({ fadeOutMs })}
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
