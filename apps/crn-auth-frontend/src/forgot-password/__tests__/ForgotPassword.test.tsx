import {
  render,
  RenderResult,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { WebAuthError } from '@asap-hub/auth-frontend-utils';

import ForgotPassword from '../ForgotPassword';

import { sendPasswordResetLink } from '../../auth0/web-auth';

jest.mock('../../auth0/web-auth');
const mockSendPasswordResetLink = sendPasswordResetLink as jest.MockedFunction<
  typeof sendPasswordResetLink
>;
beforeEach(() => {
  mockSendPasswordResetLink.mockClear();
});

it('renders the email in an input field', () => {
  const { getByLabelText } = render(
    <ForgotPassword email="john.doe@example.com" setEmail={() => {}} />,
    { wrapper: MemoryRouter },
  );
  expect(getByLabelText(/e-?mail/i)).toHaveValue('john.doe@example.com');
});

it('emits email change events', async () => {
  const handleEmailChange = jest.fn();
  const { getByLabelText } = render(
    <ForgotPassword email="" setEmail={handleEmailChange} />,
    { wrapper: MemoryRouter },
  );

  fireEvent.change(getByLabelText(/e-?mail/i), {
    target: { value: 'john.doe@example.com' },
  });
  expect(handleEmailChange).toHaveBeenLastCalledWith('john.doe@example.com');
});

it('has a button to go back in browser history', () => {
  const { getByText } = render(
    <MemoryRouter
      initialEntries={['/prev', '/forgot-password']}
      initialIndex={1}
    >
      <Route path="/prev">Previous Page</Route>
      <Route path="/forgot-password">
        <ForgotPassword email="" setEmail={() => {}} />
      </Route>
    </MemoryRouter>,
  );

  userEvent.click(getByText(/back/i));
  expect(getByText('Previous Page')).toBeVisible();
});

describe('when clicking the reset button', () => {
  let result!: RenderResult;
  beforeEach(() => {
    result = render(
      <ForgotPassword email="john.doe@example.com" setEmail={() => {}} />,
      { wrapper: MemoryRouter },
    );
  });

  it('sends a reset link', async () => {
    const resetButton = result.getByText(/reset/i, { selector: 'button *' });

    userEvent.click(resetButton);
    expect(mockSendPasswordResetLink).toHaveBeenCalledWith(
      'john.doe@example.com',
    );
  });

  describe('and a reset link is sent successfully', () => {
    beforeEach(async () => {
      mockSendPasswordResetLink.mockResolvedValue(undefined);

      const resetButton = result.getByText(/reset/i, { selector: 'button *' });
      userEvent.click(resetButton);
      await waitForElementToBeRemoved(resetButton);
    });

    it('shows a success page', () => {
      const { getByText } = result;
      expect(getByText(/email.+sent/i)).toBeVisible();
    });

    it('links back to signin', () => {
      const { getByText } = result;
      expect(getByText(/back/i).closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('and sending a reset link fails', () => {
    it('shows an error message', async () => {
      const error = new Error() as unknown as WebAuthError;
      error.errorDescription = 'Rate limit exceeded';
      mockSendPasswordResetLink.mockRejectedValue(error);

      userEvent.click(result.getByText(/reset/i, { selector: 'button *' }));
      expect(await result.findByText('Rate limit exceeded')).toBeVisible();
    });
  });
});
