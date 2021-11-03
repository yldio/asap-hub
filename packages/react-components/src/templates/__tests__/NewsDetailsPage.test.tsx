import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsDetailsPage from '../NewsDetailsPage';

const props: ComponentProps<typeof NewsDetailsPage> = {
  created: '2020-09-24T11:06:27.164Z',
  type: 'News',
  title: 'Title',
  text: 'Body',
};

it('renders the header', () => {
  const { getByRole } = render(<NewsDetailsPage {...props} />);
  expect(getByRole('heading').textContent).toMatch(/title/i);
  expect(getByRole('heading').tagName).toEqual('H1');
});
