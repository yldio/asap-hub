import { isResourceLink } from '../../src/gp2';

describe('common', () => {
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
