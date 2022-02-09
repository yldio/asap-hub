import {
  isInternalAuthor,
  isResearchOutputType,
  isResearchOutputSubtype,
  researchOutputMapSubtype,
  ExternalAuthor,
} from '../src/research-output';
import { UserResponse } from '../src/user';

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

    it('should map subtype', () => {
      expect(researchOutputMapSubtype('Analysis')).toEqual('Analysis');
    });

    it('should return null on not known subtype', () => {
      expect(researchOutputMapSubtype('NotACloningSubtype')).toBeNull();
    });
  });

  describe('isInternalAuthor', () => {
    it('should return true when author is internal', () => {
      expect(isInternalAuthor({ id: 'user-1' } as UserResponse)).toEqual(true);
    });

    it('should return false when author is external', () => {
      expect(
        isInternalAuthor({ displayName: 'user name' } as ExternalAuthor),
      ).toEqual(false);
    });
  });
});
