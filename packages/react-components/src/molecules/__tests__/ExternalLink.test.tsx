import React from 'react';
import { render } from '@testing-library/react';

import ExternalLink from '../ExternalLink';

it('renders an external link', () => {
  const { getByRole } = render(<ExternalLink href="http://example.com" />);
  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
});
