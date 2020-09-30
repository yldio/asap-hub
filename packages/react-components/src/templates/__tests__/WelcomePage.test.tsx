import React from 'react';
import { render } from '@testing-library/react';

import WelcomePage from '../WelcomePage';

it('renders the signin page ', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(<WelcomePage onClick={handleClick} />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

it('renders the signup page', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <WelcomePage allowSignup onClick={handleClick} />,
  );
  expect(getByRole('button').textContent).toMatchInlineSnapshot(
    `"Create account"`,
  );
});
