import React from 'react';
import { render } from '@testing-library/react';

import CtaCard from '../CtaCard';

it('renders a cta card with contact button', () => {
  const { getByRole } = render(<CtaCard href="test123" buttonText="Button" />);
  const link = getByRole('link');
  expect(link).toHaveAttribute('href', 'test123');
  expect(link.textContent).toEqual('Button');
});

it('renders a cta card with children', () => {
  const { getByText } = render(
    <CtaCard href="test123" buttonText="Button">
      <div>content</div>
    </CtaCard>,
  );
  const content = getByText('content');
  expect(content).toBeVisible();
  expect(content.textContent).toEqual('Button');
});
