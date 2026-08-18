import type { Chapter } from '../../api/types';
import { chapterAt, chapterEndMs, clamp, clampTooltip } from '../playback';

const chapters: Chapter[] = [
  { startMs: 0, title: 'Intro' },
  { startMs: 60000, title: 'Middle' },
  { startMs: 180000, title: 'Outro' },
];

describe('chapterAt', () => {
  it.each`
    seconds | expected
    ${0}    | ${'Intro'}
    ${59}   | ${'Intro'}
    ${60}   | ${'Middle'}
    ${179}  | ${'Middle'}
    ${180}  | ${'Outro'}
    ${9999} | ${'Outro'}
  `('returns $expected at $seconds', ({ seconds, expected }) => {
    expect(chapterAt(chapters, seconds)?.title).toEqual(expected);
  });

  it('falls back to the first chapter before any start', () => {
    expect(chapterAt([{ startMs: 5000, title: 'Late' }], 0)?.title).toEqual(
      'Late',
    );
  });

  it('returns undefined without chapters', () => {
    expect(chapterAt([], 10)).toBeUndefined();
  });
});

describe('chapterEndMs', () => {
  it('uses the next chapter start', () => {
    expect(chapterEndMs(chapters, 0, 300000)).toEqual(60000);
  });

  it('uses the duration for the last chapter', () => {
    expect(chapterEndMs(chapters, 2, 300000)).toEqual(300000);
  });
});

describe('clamp', () => {
  it('bounds the value', () => {
    expect(clamp(-1, 0, 10)).toEqual(0);
    expect(clamp(11, 0, 10)).toEqual(10);
    expect(clamp(5, 0, 10)).toEqual(5);
  });
});

describe('clampTooltip', () => {
  it('keeps the tooltip inside the player', () => {
    expect(clampTooltip(0, 100, 600)).toEqual(58);
    expect(clampTooltip(600, 100, 600)).toEqual(542);
    expect(clampTooltip(300, 100, 600)).toEqual(300);
  });
});
