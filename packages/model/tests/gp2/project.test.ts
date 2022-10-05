import { isProjectKeyword, projectKeywords } from '../../src/gp2';

describe('Project', () => {
  describe('Keywords', () => {
    it.each(projectKeywords)(
      'should recognize correct keyword - %s',
      (keyword) => {
        expect(isProjectKeyword(keyword)).toEqual(true);
      },
    );

    it('should not recognize incorrect keyword', () => {
      expect(isProjectKeyword('not-a-keyword')).toEqual(false);
    });
  });
});
