import { render } from '@testing-library/react';

import ConditionalLink from '../LinkConditional';

it('renders as text when href omitted', () => {
  const { queryByRole, getByText } = render(
    <ConditionalLink href="">example</ConditionalLink>,
  );
  expect(queryByRole('link')).not.toBeInTheDocument();
  expect(getByText(/example/i)).toBeVisible();
});
it('renders as link when provided href', () => {
  const { getByRole, getByText } = render(
    <ConditionalLink href="http://example.com">example</ConditionalLink>,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  expect(getByText(/example/i)).toBeVisible();
});
