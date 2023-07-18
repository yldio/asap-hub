import { render } from '@testing-library/react';
import Icon, { imageStyle } from '../Icon';

describe('Icon', () => {
  it('has the proper css', () => {
    const { container } = render(<Icon url="test" />);
    expect(container.firstChild).toHaveAttribute('class');
  });
  describe('imageStyle', () => {
    it('generate the proper css', () => {
      const style = imageStyle('test');
      expect(style.styles).toContain('background-image:url("test")');
    });
  });
});
