import type { Chapter } from '../api/types';

export type ChapterRow = Chapter & { key: string };

let nextKey = 0;

export const makeRow = (chapter: Chapter): ChapterRow => {
  nextKey += 1;
  return { ...chapter, key: `chapter-${nextKey}` };
};

export const toRows = (chapters: Chapter[]): ChapterRow[] =>
  chapters.map(makeRow);

export const toChapters = (rows: ChapterRow[]): Chapter[] =>
  rows.map(({ startMs, title }) => ({ startMs, title }));

export const sortRows = (rows: ChapterRow[]): ChapterRow[] =>
  [...rows].sort((a, b) => a.startMs - b.startMs);

// The first chapter always covers the start of the video, otherwise playback
// before it would sit outside every chapter.
export const snapFirstToZero = (rows: ChapterRow[]): ChapterRow[] => {
  const sorted = sortRows(rows);
  const [first, ...rest] = sorted;
  if (!first || first.startMs === 0) return sorted;
  return [{ ...first, startMs: 0 }, ...rest];
};

export const insertAt = (
  rows: ChapterRow[],
  startMs: number,
  title = '',
): { rows: ChapterRow[]; key: string } => {
  const rounded = Math.max(0, Math.round(startMs));
  const row = makeRow({ startMs: rounded, title });
  const withoutDuplicate = rows.filter(
    (existing) => existing.startMs !== rounded,
  );
  return {
    rows: snapFirstToZero([...withoutDuplicate, row]),
    key: row.key,
  };
};

export const endMsOf = (
  rows: ChapterRow[],
  index: number,
  durationMs: number,
): number => rows[index + 1]?.startMs ?? durationMs;
