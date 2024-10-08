import { isResearchTagCategory } from '../src/research-tag';

describe('Research Tag Model', () => {
  describe('Category', () => {
    it('should recognise correct category', () => {
      expect(isResearchTagCategory('Method')).toEqual(true);
    });

    it('should not recognise incorrect category', () => {
      expect(isResearchTagCategory('not-a-category')).toEqual(false);
    });
  });
});
