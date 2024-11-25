import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CookieButton from '../CookieButton';

it('renders a cookie button', () => {
  const { getByTestId } = render(
    <CookieButton toggleCookieModal={jest.fn()} />,
  );
  expect(getByTestId('cookie-button')).toBeVisible();
});

it('renders a cookie button higher then footer when isOnbordable true', () => {
  const { getByTestId } = render(
    <CookieButton toggleCookieModal={jest.fn()} isOnboardable />,
  );
  expect(getByTestId('cookie-button')).toHaveStyleRule('bottom', '7em');
});

it('should call toggleCookieModal when clicked', async () => {
  const toggleCookieModal = jest.fn();
  const { getByTestId } = render(
    <CookieButton toggleCookieModal={toggleCookieModal} />,
  );
  userEvent.click(getByTestId('cookie-button'));

  await waitFor(() => {
    expect(toggleCookieModal).toHaveBeenCalled();
  });
});
