import { render } from '@testing-library/react';

import LinkConditional from '../LinkConditional';

it('renders as text when href omitted', () => {
  const { queryByRole, getByText } = render(
    <LinkConditional href="">example</LinkConditional>,
  );
  expect(queryByRole('link')).not.toBeInTheDocument();
  expect(getByText(/example/i)).toBeVisible();
});
it('renders as link when provided href', () => {
  const { getByRole, getByText } = render(
    <LinkConditional href="http://example.com">example</LinkConditional>,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  expect(getByText(/example/i)).toBeVisible();
});
