import { render, screen } from '@testing-library/react';
import OutputsPage from '../OutputsPage';

describe('OutputsPage', () => {
  it('renders header', () => {
    render(<OutputsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
