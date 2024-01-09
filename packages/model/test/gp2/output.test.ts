import {
  isOutputDocumentType,
  outputDocumentTypes,
} from '../../src/gp2/output';

describe('Output Model', () => {
  describe('Document Types', () => {
    it.each(outputDocumentTypes)(
      'should return true when document type is %s',
      (documentType) => {
        expect(isOutputDocumentType(documentType)).toEqual(true);
      },
    );

    it('should return false when document type is invalid', () => {
      expect(isOutputDocumentType('InvalidDocumentType')).toEqual(false);
    });
  });
});
