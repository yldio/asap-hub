/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';

import type { Chapter } from '../api/types';
import {
  charcoal,
  lead,
  mint,
  paper,
  pine,
  rem,
  silver,
  steel,
} from '../ui/theme';
import { formatDuration } from '../utils/time';

const panelStyles = css({
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
  overflow: 'hidden',
});

const headingStyles = css({
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
  padding: `${rem(16)} ${rem(16)} ${rem(8)}`,
  margin: 0,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  maxHeight: rem(420),
  overflowY: 'auto',
});

const itemButtonStyles = css({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: `${rem(56)} 1fr`,
  gap: rem(12),
  alignItems: 'baseline',
  textAlign: 'left',
  border: 'none',
  borderTop: `1px solid ${silver.rgb}`,
  backgroundColor: 'transparent',
  padding: `${rem(10)} ${rem(16)}`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: rem(15),
  color: charcoal.rgb,
  ':hover, :focus-visible': { backgroundColor: silver.rgb },
});

const activeItemStyles = css({
  backgroundColor: mint.rgb,
  color: pine.rgb,
  fontWeight: 'bold',
  ':hover, :focus-visible': { backgroundColor: mint.rgb },
});

const timeStyles = css({
  fontVariantNumeric: 'tabular-nums',
  color: lead.rgb,
  fontSize: rem(13),
});

const emptyStyles = css({
  padding: rem(16),
  color: lead.rgb,
  fontSize: rem(14),
});

export const activeChapterIndex = (
  chapters: Chapter[],
  currentSeconds: number,
): number => {
  const currentMs = currentSeconds * 1000;
  let active = -1;
  chapters.forEach((chapter, index) => {
    if (chapter.startMs <= currentMs) active = index;
  });
  return active;
};

const ChapterList: FC<{
  readonly chapters: Chapter[];
  readonly currentSeconds: number;
  readonly onSelect: (chapter: Chapter) => void;
  readonly onHover?: (chapter: Chapter | null) => void;
}> = ({ chapters, currentSeconds, onSelect, onHover }) => {
  const active = activeChapterIndex(chapters, currentSeconds);

  return (
    <nav css={panelStyles} aria-label="Chapters">
      <h2 css={headingStyles}>Chapters</h2>
      {chapters.length === 0 ? (
        <p css={emptyStyles}>This demo has no chapters yet.</p>
      ) : (
        <ul css={listStyles}>
          {chapters.map((chapter, index) => (
            <li key={`${chapter.startMs}-${chapter.title}`}>
              <button
                type="button"
                css={[itemButtonStyles, index === active && activeItemStyles]}
                aria-current={index === active}
                onClick={() => onSelect(chapter)}
                onMouseEnter={() => onHover?.(chapter)}
                onMouseLeave={() => onHover?.(null)}
                onFocus={() => onHover?.(chapter)}
                onBlur={() => onHover?.(null)}
              >
                <span css={timeStyles}>{formatDuration(chapter.startMs)}</span>
                <span>{chapter.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default ChapterList;
