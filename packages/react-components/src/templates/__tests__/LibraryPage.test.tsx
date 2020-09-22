import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LibraryPage from '../LibraryPage';

const props: ComponentProps<typeof LibraryPage> = {
  query: '',
};
it('renders the header', () => {
  const { getByRole } = render(<LibraryPage {...props}>Content</LibraryPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<LibraryPage {...props}>Content</LibraryPage>);
  expect(getByText('Content')).toBeVisible();
});
