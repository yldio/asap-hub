import { isKeyword, keywords } from '../../src/gp2';

describe('common', () => {
  describe('Keywords', () => {
    it.each(keywords)('should recognise correct keyword - %s', (keyword) => {
      expect(isKeyword(keyword)).toEqual(true);
    });

    it('should not recognise incorrect keyword', () => {
      expect(isKeyword('not-a-keyword')).toEqual(false);
    });
  });
});
