/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { RecordingSession, RecordingSessionStatus } from '../../api/types';
import EditorButton from '../editor/EditorButton';
import { editorTheme } from '../editor/editorTheme';
import { PlusIcon } from '../editor/icons';

const panelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 10,
  borderRadius: 8,
  border: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.raised,
});

const hintStyles = css({
  margin: 0,
  fontSize: 12,
  color: editorTheme.muted,
  lineHeight: 1.5,
});

const snippetStyles = css({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
  color: editorTheme.text,
  backgroundColor: editorTheme.surface,
  border: `1px solid ${editorTheme.line}`,
  borderRadius: 6,
  padding: 8,
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
});

const liveStyles = css({
  fontSize: 12,
  color: editorTheme.audio,
  fontWeight: 600,
});

const waitingStyles = css({ fontSize: 12, color: editorTheme.muted });

const scriptTag = (session: RecordingSession): string =>
  `<script src="${session.snippetUrl}"></script>`;

type Props = {
  readonly session?: RecordingSession;
  readonly status?: RecordingSessionStatus;
  readonly readOnly: boolean;
  readonly onStart: () => void;
  readonly onApply: () => void;
  readonly applying: boolean;
};

const CapturePanel: FC<Props> = ({
  session,
  status,
  readOnly,
  onStart,
  onApply,
  applying,
}) => {
  const [copied, setCopied] = useState(false);

  if (!session) {
    return (
      <div css={panelStyles}>
        <p css={hintStyles}>
          Track the mouse on the site you are demoing, so clicks become
          highlights and zooms you can edit afterwards.
        </p>
        <EditorButton
          icon={<PlusIcon size={15} />}
          disabled={readOnly}
          onClick={onStart}
        >
          Track the cursor
        </EditorButton>
      </div>
    );
  }

  return (
    <div css={panelStyles}>
      <p css={hintStyles}>
        Paste this into the page you are demoing, then record as usual. It only
        sends pointer positions and clicks.
      </p>
      <textarea
        css={snippetStyles}
        readOnly
        rows={3}
        value={scriptTag(session)}
        aria-label="Capture snippet"
        onFocus={(event) => event.target.select()}
      />
      <EditorButton
        onClick={() => {
          void navigator.clipboard
            ?.writeText(scriptTag(session))
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
        }}
      >
        {copied ? 'Copied' : 'Copy the snippet'}
      </EditorButton>

      {status && status.eventCount > 0 ? (
        <span css={liveStyles}>
          {`Capture connected, ${status.eventCount} events`}
        </span>
      ) : (
        <span css={waitingStyles}>Waiting for the first events…</span>
      )}

      <EditorButton
        primary
        disabled={readOnly || applying || !status || status.eventCount === 0}
        onClick={onApply}
      >
        {applying ? 'Adding effects…' : 'Add cursor effects'}
      </EditorButton>
    </div>
  );
};

export default CapturePanel;
