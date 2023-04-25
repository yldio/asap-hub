import { date } from '../../src/utils/normalise';

describe('normalise', () => {
  describe('date', () => {
    it('preserves strings which match ISO date formats', () => {
      expect(date('2012-03-24')).toEqual('2012-03-24');
      expect(date('2012-03-24T12:00:00.000Z')).toEqual(
        '2012-03-24T12:00:00.000Z',
      );
    });

    it('converts Date instances to ISO date strings', () => {
      expect(date(new Date('2012-03-24'))).toEqual('2012-03-24T00:00:00.000Z');
    });

    it('converts all other values to null', () => {
      expect(date('string')).toEqual(null);
      expect(date(2)).toEqual(null);
      expect(date(undefined)).toEqual(null);
    });
  });
});
