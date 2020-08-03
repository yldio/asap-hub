import React from 'react';
import { render } from '@testing-library/react';
import Signin from '../Signin';

test('renders a button to signin', async () => {
  const { getByRole } = render(<Signin />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Log in"`);
});
