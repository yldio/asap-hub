/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useRef } from 'react';

import type { Chapter } from '../api/types';
import { fern, paper, rem } from '../ui/theme';
import { formatDuration, formatDurationWords } from '../utils/time';
import { chapterEndMs } from './playback';

const panelStyles = css({
  position: 'absolute',
  right: rem(12),
  bottom: '100%',
  marginBottom: rem(8),
  width: rem(300),
  maxWidth: 'calc(100% - 24px)',
  maxHeight: '60%',
  overflowY: 'auto',
  backgroundColor: 'rgba(20, 20, 20, 0.95)',
  border: `1px solid rgba(255, 255, 255, 0.15)`,
  borderRadius: rem(8),
  zIndex: 4,
});

const headingStyles = css({
  margin: 0,
  padding: `${rem(12)} ${rem(14)} ${rem(6)}`,
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  fontWeight: 'bold',
  color: 'rgba(255, 255, 255, 0.6)',
});

const listStyles = css({ listStyle: 'none', margin: 0, padding: 0 });

const rowStyles = css({
  position: 'relative',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  columnGap: rem(12),
  alignItems: 'start',
  textAlign: 'left',
  border: 'none',
  borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
  backgroundColor: 'transparent',
  padding: `${rem(10)} ${rem(14)}`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: rem(14),
  color: paper.rgb,
  ':hover, :focus-visible': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
});

const activeRowStyles = css({
  backgroundColor: 'rgba(255, 255, 255, 0.14)',
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: rem(3),
    backgroundColor: fern.rgb,
  },
});

const badgeStyles = css({
  fontSize: rem(12),
  fontVariantNumeric: 'tabular-nums',
  color: 'rgba(255, 255, 255, 0.7)',
  paddingTop: rem(2),
});

const lengthStyles = css({
  gridColumn: 1,
  fontSize: rem(12),
  color: 'rgba(255, 255, 255, 0.55)',
  paddingTop: rem(2),
});

const ChaptersPanel: FC<{
  readonly chapters: Chapter[];
  readonly durationMs: number;
  readonly activeIndex: number;
  readonly onSelect: (chapter: Chapter) => void;
}> = ({ chapters, durationMs, activeIndex, onSelect }) => {
  const activeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div css={panelStyles} data-testid="chapters-panel">
      <h3 css={headingStyles}>Chapters</h3>
      <ul css={listStyles}>
        {chapters.map((chapter, index) => (
          <li
            key={`${chapter.startMs}-${chapter.title}`}
            ref={index === activeIndex ? activeRef : undefined}
          >
            <button
              type="button"
              css={[rowStyles, index === activeIndex && activeRowStyles]}
              aria-current={index === activeIndex}
              onClick={() => onSelect(chapter)}
            >
              <span>{chapter.title}</span>
              <span css={badgeStyles}>{formatDuration(chapter.startMs)}</span>
              <span css={lengthStyles}>
                {formatDurationWords(
                  chapterEndMs(chapters, index, durationMs) - chapter.startMs,
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChaptersPanel;
