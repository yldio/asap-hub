import { getMemberships } from '../api';

describe('getMemberships', () => {
  it('returns data', () => {
    expect(getMemberships().length).toBe(2);
  });
});
