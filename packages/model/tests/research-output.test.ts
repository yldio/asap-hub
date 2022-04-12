import { UserResponse, ExternalAuthorResponse } from '@asap-hub/model';
import {
  isResearchOutputDocumentType,
  isResearchOutputSubtype,
  researchOutputMapSubtype,
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

  describe('SubType', () => {
    it('should recognize correct subtype', () => {
      expect(isResearchOutputSubtype('Report')).toEqual(true);
    });

    it('should not recognize incorrect subtype', () => {
      expect(isResearchOutputSubtype('NotAReport')).toEqual(false);
    });

    it('should map subtype', () => {
      expect(researchOutputMapSubtype('Analysis')).toEqual('Analysis');
    });

    it('should return null on not known subtype', () => {
      expect(researchOutputMapSubtype('NotACloningSubtype')).toBeNull();
    });
  });
});
