/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { Link } from 'react-router';
import { RenderJob, VideoStatus } from '../../api/types';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';

const barStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginLeft: 'auto',
  flexWrap: 'wrap',
});

const statusStyles = css({ fontSize: 13, color: editorTheme.muted });

const trackStyles = css({
  width: 120,
  height: 6,
  borderRadius: 3,
  backgroundColor: editorTheme.line,
  overflow: 'hidden',
});

const fillStyles = css({
  height: '100%',
  backgroundColor: editorTheme.playhead,
  transition: 'width 400ms linear',
});

const errorStyles = css({ fontSize: 13, color: editorTheme.record });

const linkStyles = css({
  fontSize: 13,
  color: editorTheme.playhead,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

// the container reports its own stage names, and for the per step work it
// reports the step's label, such as "clip 0 (source asset-1)"
export const stageLabel = (stage: string): string => {
  if (stage.startsWith('clip ')) {
    return 'Rendering the clips';
  }
  if (stage.startsWith('join ')) {
    return 'Joining the timeline';
  }
  return (
    {
      sources: 'Fetching the sources',
      sprite: 'Building the preview images',
      upload: 'Uploading the demo',
    }[stage] ?? 'Rendering'
  );
};

const draftStyles = css({ fontSize: 13, color: editorTheme.muted });

type Props = {
  readonly videoId: string;
  readonly render?: RenderJob;
  readonly status: VideoStatus;
  readonly hasOutput: boolean;
  readonly canRender: boolean;
  readonly readOnly: boolean;
  // false means the guard has taken over and the link must not navigate
  readonly onLeave: () => boolean;
  readonly onRender: () => void;
  readonly onCancel: () => void;
};

const RenderBar: FC<Props> = ({
  videoId,
  render,
  status,
  hasOutput,
  canRender,
  readOnly,
  onLeave,
  onRender,
  onCancel,
}) => {
  const busy = render?.state === 'queued' || render?.state === 'rendering';

  if (busy) {
    const progress = render?.progress ?? 0;
    return (
      <div css={barStyles}>
        <span css={statusStyles}>
          {render?.stage ? stageLabel(render.stage) : 'Queued'}
        </span>
        <span css={trackStyles} role="progressbar" aria-valuenow={progress}>
          <span css={fillStyles} style={{ width: `${progress}%` }} />
        </span>
        <EditorButton onClick={onCancel}>Cancel</EditorButton>
      </div>
    );
  }

  return (
    <div css={barStyles}>
      {render?.state === 'failed' ? (
        <span css={errorStyles}>
          {render.error ? `Export failed: ${render.error}` : 'Export failed'}
        </span>
      ) : null}
      {hasOutput ? (
        <Link
          css={linkStyles}
          to={`/videos/${videoId}`}
          onClick={(event) => {
            if (!onLeave()) {
              event.preventDefault();
            }
          }}
        >
          {status === 'published' ? 'View the demo' : 'Preview the demo'}
        </Link>
      ) : (
        <span css={draftStyles}>Draft, not yet a demo</span>
      )}
      <EditorButton
        primary
        disabled={readOnly || !canRender}
        onClick={onRender}
      >
        {hasOutput ? 'Export again' : 'Export to a demo'}
      </EditorButton>
    </div>
  );
};

export default RenderBar;
