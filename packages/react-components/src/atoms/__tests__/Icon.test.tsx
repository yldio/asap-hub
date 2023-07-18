import { imageStyle } from '../Icon';

describe('Icon', () => {
  describe('imageStyle', () => {
    it('returns the proper css', () => {
      const style = imageStyle('test');
      expect(style.styles).toContain('background-image:url("test")');
    });
  });
});
