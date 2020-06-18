import React from 'react';
import { render } from '@testing-library/react';

import Divider from '../Divider';

it('renders an <hr>', () => {
  const { getByRole } = render(<Divider />);
  expect(getByRole('separator')).toBeVisible();
});

it('renders given text in uppercase', () => {
  const { getByText } = render(<Divider>or</Divider>);
  expect(getByText('or')).toHaveStyleRule('text-transform', 'uppercase');
});
