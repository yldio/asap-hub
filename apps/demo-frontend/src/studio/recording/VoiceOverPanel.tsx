/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import EditorButton from '../editor/EditorButton';
import { editorTheme } from '../editor/editorTheme';
import { formatDuration } from '../editor/geometry';
import { MicrophoneIcon } from '../editor/icons';
import { VoiceRecorderStatus } from './useVoiceRecorder';

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
});

const liveStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: editorTheme.record,
  fontWeight: 600,
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
});

const dotStyles = css({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: editorTheme.record,
});

const errorStyles = css({ fontSize: 12, color: editorTheme.record });

type Props = {
  readonly status: VoiceRecorderStatus;
  readonly elapsedMs: number;
  readonly error?: string;
  readonly saving: boolean;
  readonly readOnly: boolean;
  readonly onStart: () => void;
  readonly onStop: () => void;
};

// the voice over lands on the timeline where the playhead is, so a creator can
// scrub to the section they want to narrate and talk over it
const VoiceOverPanel: FC<Props> = ({
  status,
  elapsedMs,
  error,
  saving,
  readOnly,
  onStart,
  onStop,
}) => (
  <div css={rowStyles}>
    {status === 'recording' ? (
      <>
        <span css={liveStyles}>
          <span css={dotStyles} />
          {formatDuration(elapsedMs)}
        </span>
        <EditorButton primary onClick={onStop}>
          Stop the voice over
        </EditorButton>
      </>
    ) : (
      <EditorButton
        icon={<MicrophoneIcon size={14} />}
        disabled={readOnly || saving}
        onClick={onStart}
      >
        {saving ? 'Saving…' : 'Record a voice over'}
      </EditorButton>
    )}
    {error ? <span css={errorStyles}>{error}</span> : null}
  </div>
);

export default VoiceOverPanel;
