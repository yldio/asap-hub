import { render, screen } from '@testing-library/react';

import LoadingLayout, {
  LoadingContentBody,
  LoadingContentHeader,
} from '../LoadingLayout';

it('renders the asap logo', async () => {
  render(<LoadingLayout />);
  expect(screen.getByTitle('ASAP Logo')).toBeInTheDocument();
});

it('renders LoadingContentHeader', async () => {
  const { container } = render(<LoadingContentHeader />);

  expect(container.querySelectorAll('div[class*="animation"]')).toHaveLength(4);
});

it('renders LoadingContentBody', async () => {
  const { container } = render(<LoadingContentBody />);

  expect(container.querySelectorAll('div[class*="animation"]')).toHaveLength(3);
});
