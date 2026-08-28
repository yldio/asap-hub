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

const stageLabels: Record<string, string> = {
  clips: 'Rendering the clips',
  join: 'Joining the timeline',
  finishing: 'Building the preview images',
};

type Props = {
  readonly videoId: string;
  readonly render?: RenderJob;
  readonly status: VideoStatus;
  readonly hasOutput: boolean;
  readonly canRender: boolean;
  readonly readOnly: boolean;
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
  onRender,
  onCancel,
}) => {
  const busy = render?.state === 'queued' || render?.state === 'rendering';

  if (busy) {
    const progress = render?.progress ?? 0;
    return (
      <div css={barStyles}>
        <span css={statusStyles}>
          {render?.stage ? stageLabels[render.stage] ?? 'Rendering' : 'Queued'}
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
          {render.error ? `Render failed: ${render.error}` : 'Render failed'}
        </span>
      ) : null}
      {hasOutput ? (
        <Link css={linkStyles} to={`/videos/${videoId}`}>
          {status === 'published' ? 'View the demo' : 'Preview the render'}
        </Link>
      ) : null}
      <EditorButton
        primary
        disabled={readOnly || !canRender}
        onClick={onRender}
      >
        {hasOutput ? 'Render again' : 'Render'}
      </EditorButton>
    </div>
  );
};

export default RenderBar;
