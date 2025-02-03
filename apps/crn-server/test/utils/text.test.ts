import { getCommaAndString } from '../../src/utils/text';

it('getCommaAndString separates items in array with commas (except last)', () => {
  expect(getCommaAndString([])).toEqual('');
  expect(getCommaAndString([''])).toEqual('');
  expect(getCommaAndString(['one'])).toEqual('one');
  expect(getCommaAndString(['one', 'two'])).toEqual('one and two');
  expect(getCommaAndString(['one', 'two', 'three'])).toEqual(
    'one, two and three',
  );
  expect(getCommaAndString([' one ', ' two '])).toEqual('one and two');
  expect(getCommaAndString(['one lab', 'two labs', 'three labs'])).toEqual(
    'one lab, two labs and three labs',
  );
});
