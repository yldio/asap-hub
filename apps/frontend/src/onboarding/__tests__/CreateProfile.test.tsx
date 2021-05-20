import { render } from '@testing-library/react';

import CreateProfile from '../CreateProfile';

it('renders a heading', () => {
  const { getByRole } = render(<CreateProfile />);
  expect(getByRole('heading').textContent).toMatch(/create.+profile/i);
});
