import React from 'react';
import { render } from '@testing-library/react';

import ExternalLink from '../ExternalLink';

it('renders an external link and icon', () => {
  const { getByText, getByTitle } = render(
    <ExternalLink label="example" href="http://example.com" />,
  );
  expect(getByText('example').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
  expect(getByTitle('External Link')).toBeInTheDocument();
});
