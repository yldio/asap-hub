import {
  canRedo,
  canUndo,
  historyLimit,
  initialHistory,
  record,
  redo,
  undo,
} from '../undo';

describe('record', () => {
  it('moves the present into the past', () => {
    const history = record(initialHistory('a'), 'b');

    expect(history).toEqual({ past: ['a'], present: 'b', future: [] });
  });

  it('ignores an unchanged present', () => {
    const history = initialHistory('a');

    expect(record(history, 'a')).toBe(history);
  });

  it('clears the redo stack, because that branch is gone', () => {
    const history = redo(record(record(initialHistory('a'), 'b'), 'c'));

    expect(record(undo(history), 'd').future).toEqual([]);
  });

  it('caps the past at the history limit', () => {
    const history = Array.from({ length: historyLimit + 10 }).reduce<
      ReturnType<typeof initialHistory<number>>
    >((current, _unused, index) => record(current, index), initialHistory(-1));

    expect(history.past).toHaveLength(historyLimit);
  });
});

describe('undo and redo', () => {
  it('steps backwards and forwards again', () => {
    const edited = record(record(initialHistory('a'), 'b'), 'c');

    const back = undo(edited);
    expect(back.present).toBe('b');
    expect(back.future).toEqual(['c']);

    const forward = redo(back);
    expect(forward.present).toBe('c');
    expect(forward.future).toEqual([]);
  });

  it('is a no-op at either end', () => {
    const history = initialHistory('a');

    expect(undo(history)).toBe(history);
    expect(redo(history)).toBe(history);
  });
});

describe('canUndo and canRedo', () => {
  it('report what is available', () => {
    const edited = record(initialHistory('a'), 'b');

    expect(canUndo(edited)).toBe(true);
    expect(canRedo(edited)).toBe(false);
    expect(canRedo(undo(edited))).toBe(true);
    expect(canUndo(initialHistory('a'))).toBe(false);
  });
});
