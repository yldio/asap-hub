import React from 'react';
import { render } from '@testing-library/react';

import OrcidSigninButton from '../OrcidSigninButton';

it('renders a button with the Orcid icon and text', () => {
  const { getByRole } = render(<OrcidSigninButton />);
  expect(getByRole('button').querySelector('svg > title')).toHaveTextContent(
    /ORCID/,
  );
  expect(getByRole('button')).toHaveTextContent(/ORCID/);
});

it('renders a disabled button', () => {
  const { getByRole } = render(<OrcidSigninButton enabled={false} />);
  expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
});
