import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
      <Routes>
        <Route
          path="/email-sent"
          element={<PasswordResetEmailSentPage signInHref="/signin" />}
        />
        <Route path="/signin" element={<>Signin page</>} />
      </Routes>
    </MemoryRouter>,
  );

  await userEvent.click(getByText(/sign.+in/i));
  expect(getByText('Signin page')).toBeVisible();
});
