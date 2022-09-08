import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

describe('Projects', () => {
  it('renders the Title', async () => {
    render(<Projects />);
    expect(
      screen.getByRole('heading', { name: 'Project Directory' }),
    ).toBeInTheDocument();
  });
});
