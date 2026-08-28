import { makeVideo } from '../../test-utils';
import { matchesQuery, matchesStatusFilter, sortVideos } from '../state';

// three of the four share a recorded date, which is what used to make the two
// directions disagree
const videos = [
  makeVideo({
    id: 'a',
    title: 'Alpha',
    recordedAt: '2026-08-20T09:00:00.000Z',
  }),
  makeVideo({
    id: 'b',
    title: 'Bravo',
    recordedAt: '2026-08-20T09:00:00.000Z',
  }),
  makeVideo({
    id: 'c',
    title: 'Studio smoke test',
    recordedAt: '2026-08-20T09:00:00.000Z',
  }),
  makeVideo({
    id: 'd',
    title: 'Delta',
    recordedAt: '2026-08-01T09:00:00.000Z',
  }),
];

const ids = (list: ReturnType<typeof sortVideos>) => list.map(({ id }) => id);

describe('sortVideos', () => {
  it('orders newest first', () => {
    expect(ids(sortVideos(videos, 'newest'))[3]).toEqual('d');
  });

  it('makes oldest the exact reverse of newest', () => {
    expect(ids(sortVideos(videos, 'oldest'))).toEqual(
      ids(sortVideos(videos, 'newest')).reverse(),
    );
  });

  it('keeps the reverse property whatever order the list arrives in', () => {
    const shuffled = [
      videos[3],
      videos[1],
      videos[2],
      videos[0],
    ] as typeof videos;

    expect(ids(sortVideos(shuffled, 'oldest'))).toEqual(
      ids(sortVideos(shuffled, 'newest')).reverse(),
    );
    expect(ids(sortVideos(shuffled, 'newest'))).toEqual(
      ids(sortVideos(videos, 'newest')),
    );
  });

  it('orders by title case-insensitively', () => {
    expect(
      sortVideos(
        [
          makeVideo({ id: '1', title: 'zebra' }),
          makeVideo({ id: '2', title: 'Apple' }),
        ],
        'title',
      ).map(({ title }) => title),
    ).toEqual(['Apple', 'zebra']);
  });

  it('leaves the input untouched', () => {
    const input = [...videos];
    sortVideos(input, 'oldest');
    expect(ids(input)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('matchesQuery', () => {
  it('matches part of the title case-insensitively', () => {
    expect(matchesQuery(makeVideo({ title: 'Sprint retro' }), 'RETRO')).toBe(
      true,
    );
    expect(matchesQuery(makeVideo({ title: 'Sprint retro' }), 'design')).toBe(
      false,
    );
  });
});

describe('matchesStatusFilter', () => {
  it.each([
    ['all' as const, true, true],
    ['published' as const, true, false],
    ['drafts' as const, false, true],
  ])('%s keeps published=%s draft=%s', (filter, published, draft) => {
    expect(
      matchesStatusFilter(makeVideo({ status: 'published' }), filter),
    ).toBe(published);
    expect(matchesStatusFilter(makeVideo({ status: 'draft' }), filter)).toBe(
      draft,
    );
  });
});
