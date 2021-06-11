import { render } from '@testing-library/react';

import RequiredAsterisk from '../RequiredAsterisk';

it('renders the asterisk given its required', () => {
  const { getByText } = render(<RequiredAsterisk required />);
  expect(getByText('*')).toBeVisible();
});

it('omits the asterisk given its required but omiting it is requested', () => {
  const { queryByText } = render(
    <RequiredAsterisk required omitRequiredAsterisk />,
  );
  expect(queryByText('*')).toBeNull();
});
