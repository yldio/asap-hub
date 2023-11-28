import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsDetailsPage from '../NewsDetailsPage';

const props: ComponentProps<typeof NewsDetailsPage> = {
  created: '2020-09-24T11:06:27.164Z',
  type: 'News',
  title: 'Title',
  text: 'Body',
  tags: [],
};

it('renders the header', () => {
  const { getByRole } = render(<NewsDetailsPage {...props} />);
  expect(getByRole('heading').textContent).toMatch(/title/i);
  expect(getByRole('heading').tagName).toEqual('H1');
});

it('renders the tags section if present', () => {
  const { getByRole, rerender, queryByRole } = render(
    <NewsDetailsPage {...props} />,
  );

  expect(queryByRole('heading', { name: 'Tags' })).not.toBeInTheDocument();

  rerender(<NewsDetailsPage {...props} tags={['Test Tag']} />);

  expect(getByRole('heading', { name: 'Tags' })).toBeVisible();
  expect(getByRole('link', { name: 'Test Tag' })).toBeVisible();
});
