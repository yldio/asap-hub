import { isManuscriptStatus, manuscriptMapStatus } from '../src/manuscript';

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
});
