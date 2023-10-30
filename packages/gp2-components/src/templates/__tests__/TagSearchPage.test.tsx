import { render, screen } from '@testing-library/react';

import TagSearchPage from '../TagSearchPage';

describe('TagSearchPage', () => {
  it('renders header', () => {
    render(<TagSearchPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
