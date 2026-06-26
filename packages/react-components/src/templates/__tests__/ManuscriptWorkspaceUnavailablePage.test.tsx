import { render } from '@testing-library/react';

import ManuscriptWorkspaceUnavailablePage from '../ManuscriptWorkspaceUnavailablePage';

it('renders a level 1 headline', () => {
  const { getByRole } = render(<ManuscriptWorkspaceUnavailablePage />);
  expect(getByRole('heading').tagName).toBe('H1');
});

it('links back to the dashboard', () => {
  const { getByRole } = render(<ManuscriptWorkspaceUnavailablePage />);
  expect(getByRole('link', { name: 'Return to Dashboard' })).toHaveAttribute(
    'href',
    '/',
  );
});
