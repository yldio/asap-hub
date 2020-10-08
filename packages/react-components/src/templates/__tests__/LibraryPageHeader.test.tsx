import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LibraryPageHeader from '../LibraryPageHeader';

const props: ComponentProps<typeof LibraryPageHeader> = {
  searchQuery: '',
  filters: [],
};
it('renders the header', () => {
  const { getByRole } = render(<LibraryPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <LibraryPageHeader {...props} searchQuery={'test123'} />,
  );
  expect(getByRole('textbox')).toHaveValue('test123');
});
