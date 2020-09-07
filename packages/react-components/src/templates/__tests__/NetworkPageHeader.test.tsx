import React from 'react';
import { render } from '@testing-library/react';

import NetworkPageHeader from '../NetworkPageHeader';

it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader />);
  expect(getByRole('heading')).toBeVisible();
});
