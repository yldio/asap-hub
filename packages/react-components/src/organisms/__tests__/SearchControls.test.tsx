import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SearchControls from '../SearchControls';
import { noop } from '../../utils';

const props: ComponentProps<typeof SearchControls> = {
  query: '',
  placeholder: '',
  onChangeSearch: noop,
};
it('renders the search controls', () => {
  const { getByRole } = render(<SearchControls {...props} />);
  expect(getByRole('textbox')).toBeVisible();
  expect(getByRole('button')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(<SearchControls {...props} query={'test123'} />);
  expect(getByRole('textbox')).toHaveValue('test123');
});
