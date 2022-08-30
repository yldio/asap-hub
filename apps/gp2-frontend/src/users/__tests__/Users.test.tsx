import { render, screen } from '@testing-library/react';
import Users from '../Users';

describe('Users', () => {
  it('renders the Title', async () => {
    render(<Users />);
    expect(
      screen.getByRole('heading', { name: 'User Directory' }),
    ).toBeInTheDocument();
  });
});
