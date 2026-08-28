/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import EditorButton from '../editor/EditorButton';
import { editorTheme } from '../editor/editorTheme';
import { formatDuration } from '../editor/geometry';
import { PauseIcon, PlayIcon, RecordIcon } from '../editor/icons';
import { RecorderStatus } from './useScreenRecorder';

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
});

const statusStyles = css({
  fontSize: 12,
  color: editorTheme.muted,
  fontVariantNumeric: 'tabular-nums',
});

const liveStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: editorTheme.record,
  fontWeight: 600,
  fontSize: 12,
});

const dotStyles = css({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: editorTheme.record,
});

const checkboxStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  color: editorTheme.muted,
});

const errorStyles = css({ fontSize: 12, color: editorTheme.record });

type Props = {
  readonly status: RecorderStatus;
  readonly elapsedMs: number;
  readonly error?: string;
  readonly withMicrophone: boolean;
  readonly readOnly: boolean;
  readonly unsupportedReason?: string;
  readonly onMicrophoneChange: (value: boolean) => void;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onStop: () => void;
};

const RecorderPanel: FC<Props> = ({
  status,
  elapsedMs,
  error,
  withMicrophone,
  readOnly,
  unsupportedReason,
  onMicrophoneChange,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  if (unsupportedReason) {
    return <p css={errorStyles}>{unsupportedReason}</p>;
  }

  const idle = status === 'idle';

  return (
    <div css={rowStyles}>
      {idle ? (
        <>
          <EditorButton
            danger
            icon={<RecordIcon size={14} />}
            disabled={readOnly}
            onClick={onStart}
          >
            Record screen
          </EditorButton>
          <label css={checkboxStyles}>
            <input
              type="checkbox"
              checked={withMicrophone}
              disabled={readOnly}
              onChange={(event) => onMicrophoneChange(event.target.checked)}
            />
            Microphone
          </label>
        </>
      ) : (
        <>
          <span css={liveStyles}>
            <span css={dotStyles} />
            {status === 'paused' ? 'Paused' : 'Recording'}
          </span>
          <span css={statusStyles}>{formatDuration(elapsedMs)}</span>
          {status === 'paused' ? (
            <EditorButton icon={<PlayIcon size={14} />} onClick={onResume}>
              Resume
            </EditorButton>
          ) : (
            <EditorButton
              icon={<PauseIcon size={14} />}
              disabled={status === 'finishing'}
              onClick={onPause}
            >
              Pause
            </EditorButton>
          )}
          <EditorButton
            primary
            disabled={status === 'finishing'}
            onClick={onStop}
          >
            {status === 'finishing' ? 'Saving…' : 'Stop'}
          </EditorButton>
        </>
      )}
      {error ? <span css={errorStyles}>{error}</span> : null}
    </div>
  );
};

export default RecorderPanel;
