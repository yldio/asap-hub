import {
  isResearchTagCategory,
  isResearchTagEntity,
} from '../src/research-tag';

describe('Research Tag Model', () => {
  describe('Category', () => {
    it('should recognize correct category', () => {
      expect(isResearchTagCategory('Method')).toEqual(true);
    });

    it('should not recognize incorrect category', () => {
      expect(isResearchTagCategory('not-a-category')).toEqual(false);
    });
  });

  describe('Entity', () => {
    it('should recognize correct entity', () => {
      expect(isResearchTagEntity('User')).toEqual(true);
    });

    it('should not recognize incorrect entity', () => {
      expect(isResearchTagEntity('not-an-entity')).toEqual(false);
    });
  });
});
