import { getMeetingMaterial } from '../../src/entities/event';

describe('events entity', () => {
  describe('getMeetingMaterial', () => {
    it.each([null, undefined, [], 'detail', ['item']])(
      'always returns null when meeting material permanently unavailable',
      (value) => expect(getMeetingMaterial(value, true, false, [])).toBeNull(),
    );
    it.each`
      value        | result
      ${null}      | ${null}
      ${undefined} | ${null}
      ${[]}        | ${null}
      ${'string'}  | ${'string'}
      ${['a']}     | ${['a']}
    `(
      'returns $result when material is $value and stale',
      ({ value, result }) =>
        expect(getMeetingMaterial(value, false, true, [])).toEqual(result),
    );
    it.each`
      value       | empty        | result
      ${null}     | ${undefined} | ${undefined}
      ${null}     | ${null}      | ${null}
      ${[]}       | ${[]}        | ${[]}
      ${'string'} | ${undefined} | ${'string'}
      ${['a']}    | ${[]}        | ${['a']}
    `(
      'returns $result when material is $value, empty is $empty and fresh',
      ({ value, result, empty }) =>
        expect(getMeetingMaterial(value, false, false, empty)).toEqual(result),
    );
  });
});
