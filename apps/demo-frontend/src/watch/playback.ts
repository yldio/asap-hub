import type { Chapter } from '../api/types';

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const ratioAt = (clientX: number, bounds: DOMRect): number =>
  bounds.width <= 0 ? 0 : clamp((clientX - bounds.left) / bounds.width, 0, 1);

export const chapterAt = (
  chapters: Chapter[],
  seconds: number,
): Chapter | undefined => {
  const ms = seconds * 1000;
  let found: Chapter | undefined;
  chapters.forEach((chapter) => {
    if (chapter.startMs <= ms) found = chapter;
  });
  return found ?? chapters[0];
};

export const chapterEndMs = (
  chapters: Chapter[],
  index: number,
  durationMs: number,
): number => chapters[index + 1]?.startMs ?? durationMs;

export const clampTooltip = (
  left: number,
  width: number,
  playerWidth: number,
): number => clamp(left, width / 2 + 8, Math.max(width / 2 + 8, playerWidth - width / 2 - 8));
