import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SearchAndFilter from '../SearchAndFilter';
import { noop } from '../../utils';

const props: ComponentProps<typeof SearchAndFilter> = {
  searchQuery: '',
  searchPlaceholder: '',
  onChangeSearch: noop,
  filterOptions: [],
};
it('renders the search and filter controls', () => {
  const { getByRole } = render(<SearchAndFilter {...props} />);
  expect(getByRole('searchbox')).toBeVisible();
  expect(getByRole('button')).toBeVisible();
});

it('passes query correctly', () => {
  const { getByRole } = render(
    <SearchAndFilter {...props} searchQuery="test123" />,
  );
  expect(getByRole('searchbox')).toHaveValue('test123');
});
