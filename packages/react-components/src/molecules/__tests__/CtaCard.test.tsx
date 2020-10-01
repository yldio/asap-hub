import React from 'react';
import { render } from '@testing-library/react';

import CtaCard from '../CtaCard';

it('renders a cta card, passing through props', () => {
  const { getByRole } = render(<CtaCard href="test123" buttonText="Button" />);
  const link = getByRole('link');
  expect(link).toHaveAttribute('href', 'test123');
  expect(link.textContent).toEqual('Button');
});
