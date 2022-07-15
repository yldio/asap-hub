import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';

import NewsSection from '../NewsSection';

const props: ComponentProps<typeof NewsSection> = {
  news: [],
  title: '',
};

it('renders a title', () => {
  render(<NewsSection {...props} title="Example" />);
  expect(screen.getByText('Example', { selector: 'h2' })).toBeVisible();
});

it('renders a subtitle', () => {
  render(<NewsSection {...props} subtitle="Example" />);
  expect(screen.getByText(/Example/)).toBeVisible();
});
