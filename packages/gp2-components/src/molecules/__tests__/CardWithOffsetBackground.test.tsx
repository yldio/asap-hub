import { render, screen } from '@testing-library/react';
import CardWithOffsetBackground from '../CardWithOffsetBackground';

describe('CardWithOffsetBackground', () => {
  it('renders the children', () => {
    render(<CardWithOffsetBackground>Content</CardWithOffsetBackground>);
    expect(screen.getByText('Content')).toBeVisible();
  });
});
