import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsPage from '../NewsPage';

const props: ComponentProps<typeof NewsPage> = {
  searchQuery: '',
  onChangeSearch: jest.fn(),
};

it('renders the header', () => {
  const { getByRole } = render(<NewsPage {...props}>Content</NewsPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<NewsPage {...props}>Content</NewsPage>);
  expect(getByText('Content')).toBeVisible();
});
