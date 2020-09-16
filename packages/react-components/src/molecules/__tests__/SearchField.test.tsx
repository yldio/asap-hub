import React from 'react';
import { render } from '@testing-library/react';

import SearchField from '../SearchField';

it('renders a search field, passing through props', () => {
  const { getByRole } = render(<SearchField placeholder="test" value="" />);
  expect(getByRole('textbox')).toHaveAttribute('placeholder', 'test');
});
