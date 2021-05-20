import { render } from '@testing-library/react';

import BackLink from '../BackLink';

it('renders a link to the back href saying it goes back', () => {
  const { getByText } = render(<BackLink href="https://example.com" />);
  expect(getByText(/back/i).closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});
