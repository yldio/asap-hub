import { resolveChapters } from '../chapters';
import { createEmptyTimeline } from '../document';
import { Timeline } from '../schema';

const source = (id: string, durationMs: number) =>
  ({
    kind: 'source' as const,
    id,
    assetId: `asset-${id}`,
    inMs: 0,
    outMs: durationMs,
    volume: 1,
  }) as const;

const title = (id: string, text: string, durationMs = 3000) =>
  ({
    kind: 'title' as const,
    id,
    durationMs,
    preset: 'centered' as const,
    text,
  }) as const;

const timeline = (overrides: Partial<Timeline> = {}): Timeline => ({
  ...createEmptyTimeline(),
  ...overrides,
});

describe('resolveChapters', () => {
  it('has none for an empty timeline', () => {
    expect(resolveChapters(timeline())).toEqual([]);
  });

  it('makes a chapter of every title card, at its place in the program', () => {
    expect(
      resolveChapters(
        timeline({
          clips: [
            source('a', 4000),
            title('t1', 'Attendance'),
            source('b', 5000),
            title('t2', 'Speakers'),
          ],
        }),
      ),
    ).toEqual([
      { id: 't1', kind: 'title', startMs: 4000, title: 'Attendance' },
      { id: 't2', kind: 'title', startMs: 12000, title: 'Speakers' },
    ]);
  });

  it('resolves a marker against the clip it is anchored to', () => {
    expect(
      resolveChapters(
        timeline({
          clips: [source('a', 4000), source('b', 5000)],
          chapters: [
            { id: 'c1', clipId: 'b', offsetMs: 1500, title: 'The new page' },
          ],
        }),
      ),
    ).toEqual([
      { id: 'c1', kind: 'marker', startMs: 5500, title: 'The new page' },
    ]);
  });

  it('sorts markers and title cards together', () => {
    const resolved = resolveChapters(
      timeline({
        clips: [source('a', 6000), title('t1', 'Speakers')],
        chapters: [{ id: 'c1', clipId: 'a', offsetMs: 2000, title: 'Intro' }],
      }),
    );

    expect(resolved.map(({ title: name }) => name)).toEqual([
      'Intro',
      'Speakers',
    ]);
  });

  it('ignores a marker whose clip has gone', () => {
    expect(
      resolveChapters(
        timeline({
          clips: [source('a', 4000)],
          chapters: [{ id: 'c1', clipId: 'ghost', offsetMs: 0, title: 'Gone' }],
        }),
      ),
    ).toEqual([]);
  });

  it('keeps an untitled marker when the editor asks for it', () => {
    const resolved = resolveChapters(
      timeline({
        clips: [source('a', 4000)],
        chapters: [{ id: 'c1', clipId: 'a', offsetMs: 0, title: '' }],
      }),
      { forEditing: true },
    );

    expect(resolved).toEqual([
      { id: 'c1', kind: 'marker', startMs: 0, title: '' },
    ]);
  });

  it('ignores an untitled marker or title card', () => {
    expect(
      resolveChapters(
        timeline({
          clips: [source('a', 4000), title('t1', '   ')],
          chapters: [{ id: 'c1', clipId: 'a', offsetMs: 0, title: '  ' }],
        }),
      ),
    ).toEqual([]);
  });

  it('never emits two chapters on the same frame', () => {
    expect(
      resolveChapters(
        timeline({
          clips: [source('a', 4000), title('t1', 'Attendance')],
          chapters: [
            { id: 'c1', clipId: 't1', offsetMs: 0, title: 'Also attendance' },
          ],
        }),
      ),
    ).toHaveLength(1);
  });
});

describe('two markers on the same frame', () => {
  const doubled = (): Timeline =>
    timeline({
      clips: [source('a', 8000)],
      chapters: [
        { id: 'm1', clipId: 'a', offsetMs: 2000, title: 'First' },
        { id: 'm2', clipId: 'a', offsetMs: 2000, title: 'Second' },
      ],
    });

  // the player would get an empty segment, so the render keeps only one
  it('collapses to one for the render', () => {
    expect(resolveChapters(doubled())).toHaveLength(1);
  });

  // ...but hiding the spare in the editor left no way to delete it, which read
  // as "the chapter I added never saved"
  it('shows both to the editor so the spare can be removed', () => {
    expect(
      resolveChapters(doubled(), { forEditing: true }).map(
        (chapter) => chapter.title,
      ),
    ).toEqual(['First', 'Second']);
  });
});
