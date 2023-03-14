import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import EmptyState from '../EmptyState';

const testSvg = (
  <svg>
    <title>Icon</title>
  </svg>
);

const props: ComponentProps<typeof EmptyState> = {
  title: 'a title',
  description: 'a description',
  icon: testSvg,
};

it('displays the title, description and icon', () => {
  render(<EmptyState {...props} />);
  expect(screen.getByRole('heading', { name: /a title/i })).toBeVisible();
  expect(screen.getByText('a description')).toBeVisible();
  expect(screen.getByTitle('Icon')).toBeInTheDocument();
});
