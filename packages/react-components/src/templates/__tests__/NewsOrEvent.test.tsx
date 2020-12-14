import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsOrEventPage from '../NewsOrEventPage';

const props: ComponentProps<typeof NewsOrEventPage> = {
  type: 'News',
  title: 'Title',
  text: 'Body',
};

it('renders the header', () => {
  const { getByRole } = render(<NewsOrEventPage {...props} />);
  expect(getByRole('heading').textContent).toMatch(/title/i);
  expect(getByRole('heading').tagName).toEqual('H1');
});
