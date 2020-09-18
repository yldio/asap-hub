import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkPage from '../NetworkPage';
import { noop } from '../../utils';

const props: ComponentProps<typeof NetworkPage> = {
  searchOnChange: noop,
  toggleOnChange: noop,
  page: 'teams',
  query: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPage {...props}>Content</NetworkPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<NetworkPage {...props}>Content</NetworkPage>);
  expect(getByText('Content')).toBeVisible();
});
