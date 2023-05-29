import {
  isKeyword,
  isMilestoneStatus,
  isResourceLink,
  keywords,
  milestoneStatus,
} from '../../src/gp2';

describe('common', () => {
  describe('Keywords', () => {
    it.each(keywords)('should recognise correct keyword - %s', (keyword) => {
      expect(isKeyword(keyword)).toEqual(true);
    });

    it('should not recognise incorrect keyword', () => {
      expect(isKeyword('not-a-keyword')).toEqual(false);
    });
  });
  describe('MilestoneStatus', () => {
    it.each(milestoneStatus)(
      'should recognise correct status - %s',
      (status) => {
        expect(isMilestoneStatus(status)).toEqual(true);
      },
    );

    it('should not recognise incorrect status', () => {
      expect(isMilestoneStatus('not-a-status')).toEqual(false);
    });
  });
  describe('Resource Link', () => {
    it('should recognise correct Resource Link', () => {
      expect(
        isResourceLink({
          type: 'Link',
          title: 'a title',
          externalLink: 'http://example.com/a-link',
        }),
      ).toEqual(true);
    });

    it('should recognise Resource Note', () => {
      expect(
        isResourceLink({
          type: 'Note',
          title: 'a title',
        }),
      ).toEqual(false);
    });
  });
});
