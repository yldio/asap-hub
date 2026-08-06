import {
  isManuscriptStatus,
  manuscriptMapStatus,
  mapManuscriptTypeToSubType,
  mapManuscriptLifecycleToType,
  manuscriptIdFromVersionRecordId,
  toManuscriptVersionRecordId,
} from '../src/manuscript';

describe('Manuscript Model', () => {
  describe('Status', () => {
    it('should recognise correct type', () => {
      expect(isManuscriptStatus('Compliant')).toEqual(true);
    });

    it('should not recognise incorrect type', () => {
      expect(isManuscriptStatus('NotAStatus')).toEqual(false);
    });

    it('should map type', () => {
      expect(manuscriptMapStatus('Compliant')).toEqual('Compliant');
    });

    it('should return null on not known type', () => {
      expect(manuscriptMapStatus('NotAStatus')).toBeNull();
    });
  });

  describe('mapManuscriptTypeToSubType', () => {
    it('should return "Original Research" for "Original Research" type', () => {
      expect(mapManuscriptTypeToSubType('Original Research')).toEqual(
        'Original Research',
      );
    });

    it('should return "Review" for "Review / Op-Ed / Letter / Hot Topic" type', () => {
      expect(
        mapManuscriptTypeToSubType('Review / Op-Ed / Letter / Hot Topic'),
      ).toEqual('Review');
    });
  });

  describe('mapManuscriptLifecycleToType', () => {
    it('should return "Preprint" for "Preprint" lifecycle', () => {
      expect(mapManuscriptLifecycleToType('Preprint')).toEqual('Preprint');
    });

    it('should return "Published" for "Draft Manuscript (prior to Publication)" lifecycle', () => {
      expect(
        mapManuscriptLifecycleToType('Draft Manuscript (prior to Publication)'),
      ).toEqual('Published');
    });

    it('should return "Published" for "Typeset proof" lifecycle', () => {
      expect(mapManuscriptLifecycleToType('Typeset proof')).toEqual(
        'Published',
      );
    });

    it('should return "Published" for "Publication" lifecycle', () => {
      expect(mapManuscriptLifecycleToType('Publication')).toEqual('Published');
    });

    it('should return "Published" for "Publication with addendum or corrigendum" lifecycle', () => {
      expect(
        mapManuscriptLifecycleToType(
          'Publication with addendum or corrigendum',
        ),
      ).toEqual('Published');
    });

    it('should return "Published" for "Other" lifecycle', () => {
      expect(mapManuscriptLifecycleToType('Other')).toEqual('Published');
    });
  });

  describe('Version record id', () => {
    it('should namespace a manuscript id with the record prefix', () => {
      expect(toManuscriptVersionRecordId('manuscript-1')).toEqual(
        'mv-manuscript-1',
      );
    });

    it('should strip the record prefix back off', () => {
      expect(manuscriptIdFromVersionRecordId('mv-manuscript-1')).toEqual(
        'manuscript-1',
      );
    });

    it('should round trip a manuscript id', () => {
      expect(
        manuscriptIdFromVersionRecordId(
          toManuscriptVersionRecordId('manuscript-1'),
        ),
      ).toEqual('manuscript-1');
    });

    it('should leave an id without the prefix untouched', () => {
      expect(manuscriptIdFromVersionRecordId('manuscript-1')).toEqual(
        'manuscript-1',
      );
    });

    it('should only strip the prefix at the start of the id', () => {
      expect(manuscriptIdFromVersionRecordId('manuscript-mv-1')).toEqual(
        'manuscript-mv-1',
      );
    });
  });
});
