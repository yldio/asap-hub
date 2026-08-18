import {
  endMsOf,
  insertAt,
  snapFirstToZero,
  sortRows,
  toChapters,
  toRows,
} from '../chapters';

const rowsOf = (...starts: number[]) =>
  toRows(starts.map((startMs) => ({ startMs, title: `at ${startMs}` })));

describe('insertAt', () => {
  it('snaps a lone chapter to the start of the video', () => {
    const { rows } = insertAt([], 120000);
    expect(toChapters(rows)).toEqual([{ startMs: 0, title: '' }]);
  });

  it('inserts a later chapter in sorted position', () => {
    const { rows } = insertAt(rowsOf(0, 300000), 120000);
    expect(rows.map(({ startMs }) => startMs)).toEqual([0, 120000, 300000]);
  });

  it('returns the key of the row it created so it can be focused', () => {
    const existing = rowsOf(0);
    const { rows, key } = insertAt(existing, 90000);
    expect(rows.find((row) => row.key === key)?.startMs).toEqual(90000);
  });

  it('replaces a chapter that already starts at the same millisecond', () => {
    const { rows } = insertAt(rowsOf(0, 120000), 120000);
    expect(rows).toHaveLength(2);
  });

  it('rounds and clamps the playhead position', () => {
    const { rows } = insertAt(rowsOf(0), 90000.6);
    expect(rows[1]?.startMs).toEqual(90001);
    expect(insertAt(rowsOf(0), -50).rows[0]?.startMs).toEqual(0);
  });
});

describe('snapFirstToZero', () => {
  it('moves the earliest chapter back to zero', () => {
    expect(snapFirstToZero(rowsOf(30000, 90000)).map((r) => r.startMs)).toEqual(
      [0, 90000],
    );
  });

  it('leaves an already anchored list alone', () => {
    expect(snapFirstToZero(rowsOf(0, 90000)).map((r) => r.startMs)).toEqual([
      0, 90000,
    ]);
  });

  it('handles an empty list', () => {
    expect(snapFirstToZero([])).toEqual([]);
  });
});

describe('sortRows', () => {
  it('orders by start time without mutating the input', () => {
    const rows = rowsOf(90000, 0, 30000);
    expect(sortRows(rows).map((r) => r.startMs)).toEqual([0, 30000, 90000]);
    expect(rows.map((r) => r.startMs)).toEqual([90000, 0, 30000]);
  });
});

describe('endMsOf', () => {
  it('uses the next chapter start as the end', () => {
    expect(endMsOf(rowsOf(0, 90000), 0, 600000)).toEqual(90000);
  });

  it('uses the video duration for the last chapter', () => {
    expect(endMsOf(rowsOf(0, 90000), 1, 600000)).toEqual(600000);
  });
});
