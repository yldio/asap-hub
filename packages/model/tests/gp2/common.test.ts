import { isKeyword, keywords } from '../../src/gp2';

describe('Common', () => {
  describe('Keywords', () => {
    it.each(keywords)('should recognize correct keyword - %s', (keyword) => {
      expect(isKeyword(keyword)).toEqual(true);
    });

    it('should not recognize incorrect keyword', () => {
      expect(isKeyword('not-a-keyword')).toEqual(false);
    });
  });
});
