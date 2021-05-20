import { render } from '@testing-library/react';

import GoogleSigninButton from '../GoogleSigninButton';

it('renders a button with the Google icon and text', () => {
  const { getByRole } = render(<GoogleSigninButton />);
  expect(getByRole('button').querySelector('svg > title')).toHaveTextContent(
    /Google/,
  );
  expect(getByRole('button')).toHaveTextContent(/Google/);
});

it('renders a disabled button', () => {
  const { getByRole } = render(<GoogleSigninButton enabled={false} />);
  expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
});
