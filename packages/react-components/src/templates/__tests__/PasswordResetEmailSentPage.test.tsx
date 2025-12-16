import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

import PasswordResetEmailSentPage from '../PasswordResetEmailSentPage';

it('renders a heading', () => {
  const { getByRole } = render(
    <PasswordResetEmailSentPage signInHref="/signin" />,
  );
  expect(getByRole('heading')).toHaveTextContent(/email.+sent/i);
});

it('links back to sign in', async () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/email-sent']}>
      <Route path="/email-sent">
        <PasswordResetEmailSentPage signInHref="/signin" />,
      </Route>
      <Route path="/signin">Signin page</Route>
    </MemoryRouter>,
  );

  await userEvent.click(getByText(/sign.+in/i));
  expect(getByText('Signin page')).toBeVisible();
});
