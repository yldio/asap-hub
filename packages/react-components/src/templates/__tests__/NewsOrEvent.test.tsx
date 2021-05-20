import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsOrEventPage from '../NewsOrEventPage';

const props: ComponentProps<typeof NewsOrEventPage> = {
  created: '2020-09-24T11:06:27.164Z',
  type: 'News',
  title: 'Title',
  text: 'Body',
};

it('renders the header', () => {
  const { getByRole } = render(<NewsOrEventPage {...props} />);
  expect(getByRole('heading').textContent).toMatch(/title/i);
  expect(getByRole('heading').tagName).toEqual('H1');
});
