import {
  isResearchOutputType,
  isResearchOutputSubtype,
  isResearchOutputDeprecatedSubtype,
  researchOutputMapSubtype,
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

    it('should recognize deprecated subtype', () => {
      expect(isResearchOutputDeprecatedSubtype('Teem meeting')).toEqual(true);
    });

    it('should not recognize incorrect deprecated subtype', () => {
      expect(isResearchOutputDeprecatedSubtype('Assay')).toEqual(false);
    });

    it('should map deprecated subtype', () => {
      expect(researchOutputMapSubtype('Teem meeting')).toEqual('Team meeting');
    });

    it('should pass not deprecated subtype', () => {
      expect(researchOutputMapSubtype('Cloning')).toEqual('Cloning');
    });

    it('should return null on not known subtype', () => {
      expect(researchOutputMapSubtype('NotACloningSubtype')).toBeNull();
    });
  });
});
