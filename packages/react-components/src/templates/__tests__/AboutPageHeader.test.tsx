import { render, screen } from '@testing-library/react';

import AboutPageHeader from '../AboutPageHeader';

it('renders the header', () => {
  render(<AboutPageHeader />);
  expect(screen.getByText(/About ASAP/, { selector: 'h2' })).toBeVisible();
});
