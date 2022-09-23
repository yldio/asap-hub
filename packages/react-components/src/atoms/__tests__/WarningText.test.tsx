import { render } from '@testing-library/react';

import WarningText from '../WarningText';

it('shows the correct text and icon', () => {
  const { getByText } = render(<WarningText text="this is the correct text" />);
  expect(getByText('Info Circle Yellow')).toBeInTheDocument();
  expect(getByText('this is the correct text')).toBeVisible();
});
