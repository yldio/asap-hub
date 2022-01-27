import {
  isResearchOutputType,
  isResearchOutputSubtype,
  researchOutputMapSubtype
} from '../src/research-output';

describe('Research Output Model', () => {
  describe('Type', () => {
    it('should recognize correct type', () => {
      expect(isResearchOutputType('Dataset')).toEqual(true);
    });

    it('should not recognize incorrect type', () => {
      expect(isResearchOutputType('NotADataset')).toEqual(false);
    });
  });

  describe('SubType', () => {
    it('should recognize correct subtype', () => {
      expect(isResearchOutputSubtype('Report')).toEqual(true);
    });

    it('should not recognize incorrect subtype', () => {
      expect(isResearchOutputSubtype('NotAReport')).toEqual(false);
    });

    it('should map deprecated subtype', () => {
      expect(researchOutputMapSubtype('Assays')).toEqual('Assay');
    });

    it('should pass not deprecated subtype', () => {
      expect(researchOutputMapSubtype('Cloning')).toEqual('Cloning');
    });

    it('should return null on not known subtype', () => {
      expect(researchOutputMapSubtype('NotACloningSubtype')).toBeNull();
    });
  });
});
