import React from 'react';
import { render } from '@testing-library/react';

import Gradient from '../Gradient';

it('renders a gradient', () => {
  const { getByRole } = render(<Gradient />);

  const { height } = getComputedStyle(getByRole('presentation'));
  expect(height).toEqual('6px');
});
