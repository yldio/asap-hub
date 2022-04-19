import {
  isResearchOutputDocumentType,
  isResearchOutputType,
  researchOutputMapType,
} from '../src/research-output';

describe('Research Output Model', () => {
  describe('Type', () => {
    it('should recognize correct type', () => {
      expect(isResearchOutputDocumentType('Dataset')).toEqual(true);
    });

    it('should not recognize incorrect type', () => {
      expect(isResearchOutputDocumentType('NotADataset')).toEqual(false);
    });
  });

  describe('Type', () => {
    it('should recognize correct type', () => {
      expect(isResearchOutputType('Report')).toEqual(true);
    });

    it('should not recognize incorrect type', () => {
      expect(isResearchOutputType('NotAReport')).toEqual(false);
    });

    it('should map type', () => {
      expect(researchOutputMapType('Analysis')).toEqual('Analysis');
    });

    it('should return null on not known type', () => {
      expect(researchOutputMapType('NotACloningType')).toBeNull();
    });
  });
});
