import {
  isResearchTagCategory,
  isResearchTagEntity,
} from '../src/research-tag';

describe('Research Tag Model', () => {
  describe('Category', () => {
    it('should recognise correct category', () => {
      expect(isResearchTagCategory('Method')).toEqual(true);
    });

    it('should not recognise incorrect category', () => {
      expect(isResearchTagCategory('not-a-category')).toEqual(false);
    });
  });

  describe('Entity', () => {
    it('should recognise correct entity', () => {
      expect(isResearchTagEntity('User')).toEqual(true);
    });

    it('should not recognise incorrect entity', () => {
      expect(isResearchTagEntity('not-an-entity')).toEqual(false);
    });
  });
});
