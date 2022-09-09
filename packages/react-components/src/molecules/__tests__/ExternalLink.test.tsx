import { render } from '@testing-library/react';

import ExternalLink from '../ExternalLink';

it('renders an external link as an icon with label', () => {
  const { getByText, getByTitle } = render(
    <ExternalLink label="example" href="http://example.com" full />,
  );
  expect(getByText('example').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
  expect(getByTitle('External Link')).toBeInTheDocument();
});

it('renders an external link as an icon', () => {
  const { getByRole, getByTitle } = render(
    <ExternalLink href="http://example.com" />,
  );

  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  expect(getByTitle('External Link')).toBeInTheDocument();
});
