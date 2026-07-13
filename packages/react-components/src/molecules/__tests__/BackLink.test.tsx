import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BackLink from '../BackLink';

const historyBack = jest.spyOn(window.history, 'back').mockImplementation();
afterEach(() => {
  historyBack.mockClear();
  window.history.replaceState(null, '');
});

it('renders a link to the back href saying it goes back', () => {
  const { getByText } = render(<BackLink href="https://example.com" />);
  expect(getByText(/back/i).closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('navigates through the browser history when there are previous in-app entries', async () => {
  window.history.replaceState({ idx: 2 }, '');
  const { getByText } = render(<BackLink href="/fallback" />);

  await userEvent.click(getByText(/back/i));
  expect(historyBack).toHaveBeenCalled();
});

it('follows the href when there is no previous in-app entry', async () => {
  window.history.replaceState({ idx: 0 }, '');
  const { getByText } = render(<BackLink href="https://example.com" />);

  await userEvent.click(getByText(/back/i));
  expect(historyBack).not.toHaveBeenCalled();
});
