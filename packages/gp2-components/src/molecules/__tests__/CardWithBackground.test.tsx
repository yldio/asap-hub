import { render, screen } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import CardWithBackground from '../CardWithBackground';

describe('CardWithBackground', () => {
  it('renders the children', () => {
    render(<CardWithBackground image="image.png">Content</CardWithBackground>);
    expect(screen.getByText('Content')).toBeVisible();
  });
  it('uses the image as a background-image', () => {
    render(<CardWithBackground image="image.png">Content</CardWithBackground>);

    expect(
      findParentWithStyle(screen.getByText('Content'), 'backgroundImage')
        ?.backgroundImage,
    ).toBe('url(image.png)');
  });
});
