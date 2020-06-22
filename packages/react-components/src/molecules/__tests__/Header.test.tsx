import React from 'react';
import { render } from '@testing-library/react';

import Header from '../Header';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Header />);
  expect(getByAltText(/asap.+logo/i)).toHaveAttribute(
    'src',
    expect.stringMatching(/asap/i),
  );
});
