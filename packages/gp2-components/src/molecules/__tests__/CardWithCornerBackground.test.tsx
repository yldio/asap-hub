import { render, screen } from '@testing-library/react';
import CardWithCornerBackground from '../CardWithCornerBackground';

describe('CardWithCornerBackground', () => {
  it('renders the children', () => {
    render(<CardWithCornerBackground>Content</CardWithCornerBackground>);
    expect(screen.getByText('Content')).toBeVisible();
  });
});
