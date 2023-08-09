import { safeParse } from '../../src/utils/error';

describe('safeParse', () => {
  it('parses string in json format', () => {
    expect(safeParse('{"status":400}')).toEqual({ status: 400 });
  });

  it('does not throw and returns null when string is not in json format', () => {
    expect(safeParse('anything')).toEqual(null);
  });
});
