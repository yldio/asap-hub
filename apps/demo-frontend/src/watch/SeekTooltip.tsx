/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';

import type { Chapter } from '../api/types';
import { paper, rem } from '../ui/theme';
import { formatDuration } from '../utils/time';
import { cueAt, ThumbnailCue } from '../utils/vtt';
import { chapterAt, clampTooltip } from './playback';

const wrapperStyles = css({
  position: 'absolute',
  bottom: '100%',
  marginBottom: rem(8),
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  display: 'grid',
  justifyItems: 'center',
  gap: rem(2),
  zIndex: 3,
});

const frameStyles = css({
  borderRadius: rem(4),
  border: `1px solid rgba(255, 255, 255, 0.25)`,
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});

const titleStyles = css({
  maxWidth: rem(240),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: rem(14),
  fontWeight: 'bold',
  color: paper.rgb,
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
});

const timeStyles = css({
  fontSize: rem(13),
  fontVariantNumeric: 'tabular-nums',
  color: 'rgba(255, 255, 255, 0.9)',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
});

const TOOLTIP_WIDTH = 168;

const SeekTooltip: FC<{
  readonly spriteUrl: string;
  readonly cues: ThumbnailCue[];
  readonly chapters: Chapter[];
  readonly seconds: number;
  readonly left: number;
  readonly playerWidth: number;
}> = ({ spriteUrl, cues, chapters, seconds, left, playerWidth }) => {
  const cue = cueAt(cues, seconds);
  const chapter =
    chapters.length > 0 ? chapterAt(chapters, seconds) : undefined;
  const width = cue?.width ?? TOOLTIP_WIDTH;

  return (
    <div
      css={wrapperStyles}
      style={{ left: clampTooltip(left, width, playerWidth) }}
      data-testid="seek-tooltip"
    >
      {cue && (
        <div css={frameStyles}>
          <div
            style={{
              width: cue.width,
              height: cue.height,
              backgroundImage: `url(${spriteUrl})`,
              backgroundPosition: `-${cue.x}px -${cue.y}px`,
            }}
          />
        </div>
      )}
      {chapter && <div css={titleStyles}>{chapter.title}</div>}
      <div css={timeStyles}>{formatDuration(seconds * 1000)}</div>
    </div>
  );
};

export default SeekTooltip;
