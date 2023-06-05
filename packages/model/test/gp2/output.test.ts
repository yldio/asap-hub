import {
  isOutputDocumentType,
  isOutputSubType,
  isOutputType,
  outputDocumentTypes,
  outputSubtypes,
  outputTypes,
} from '../../src/gp2';

describe('project', () => {
  describe('isOutputDocumentType', () => {
    it.each(outputDocumentTypes)(
      'should recognise correct value %s',
      (value) => {
        expect(isOutputDocumentType(value)).toEqual(true);
      },
    );

    it('should not recognise incorrect value', () => {
      expect(isOutputDocumentType('not-valid')).toEqual(false);
    });
  });
  describe('isOutputType', () => {
    it.each(outputTypes)('should recognise correct value %s', (value) => {
      expect(isOutputType(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isOutputType('not-valid')).toEqual(false);
    });
  });
  describe('isOutputSubType', () => {
    it.each(outputSubtypes)('should recognise correct value %s', (value) => {
      expect(isOutputSubType(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isOutputSubType('not-valid')).toEqual(false);
    });
  });
});
