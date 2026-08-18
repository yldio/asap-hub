import { formatDuration, formatRecordedAt } from '../time';

describe('formatDuration', () => {
  it.each`
    milliseconds | expected
    ${0}         | ${'0:00'}
    ${9000}      | ${'0:09'}
    ${561000}    | ${'9:21'}
    ${3600000}   | ${'1:00:00'}
    ${3725000}   | ${'1:02:05'}
  `('formats $milliseconds as $expected', ({ milliseconds, expected }) => {
    expect(formatDuration(milliseconds)).toEqual(expected);
  });

  it('clamps negative durations to zero', () => {
    expect(formatDuration(-1000)).toEqual('0:00');
  });
});

describe('formatRecordedAt', () => {
  it('formats an ISO date', () => {
    expect(formatRecordedAt('2026-08-18T10:30:00.000Z')).toEqual('18 Aug 2026');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatRecordedAt('not a date')).toEqual('');
  });
});
