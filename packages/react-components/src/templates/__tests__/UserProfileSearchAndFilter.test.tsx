import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserProfileSearchAndFilter from '../UserProfileSearchAndFilter';

const props: ComponentProps<typeof UserProfileSearchAndFilter> = {
  searchQuery: '',
  filters: new Set(),
  onChangeSearch: jest.fn(),
  onChangeFilter: jest.fn(),
};
it('renders the search box and filters button', () => {
  const { getByRole, getByText } = render(
    <UserProfileSearchAndFilter {...props} />,
  );
  expect(getByRole('searchbox')).toBeVisible();
  expect(getByText('Filters').closest('button')).toBeVisible();
});

it('calls the onChangeQuery when search input changes', () => {
  const { getByRole } = render(<UserProfileSearchAndFilter {...props} />);
  userEvent.type(getByRole('searchbox'), 'searchterm');
  [...'searchterm'].forEach((letter, index) =>
    expect(props.onChangeSearch).toHaveBeenNthCalledWith(index + 1, letter),
  );
});
it('calls the onChangeFilter when filter is selected', () => {
  const { getByText, getByLabelText } = render(
    <UserProfileSearchAndFilter {...props} />,
  );
  userEvent.click(getByText('Filters'));
  userEvent.click(getByLabelText('Proposal'));

  expect(props.onChangeFilter).toHaveBeenCalledWith('Proposal');
});
