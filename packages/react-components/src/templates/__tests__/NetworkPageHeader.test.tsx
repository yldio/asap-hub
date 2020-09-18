import React, { ComponentProps } from 'react';
import { render, fireEvent } from '@testing-library/react';

import NetworkPageHeader from '../NetworkPageHeader';

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'teams',
  query: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('Displays relevant page information', () => {
  const { getByText, getByRole, rerender } = render(
    <NetworkPageHeader {...props} page={'teams'} />,
  );
  expect(getByText('Teams')).toBeChecked();
  expect(getByText('People')).not.toBeChecked();
  expect(
    (getByRole('textbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Search for a team…"`);

  rerender(<NetworkPageHeader {...props} page={'users'} />);
  expect(getByText('Teams')).not.toBeChecked();
  expect(getByText('People')).toBeChecked();
  expect(
    (getByRole('textbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Search for someone…"`);
});

it('triggers onChangeToggle', async () => {
  const onChangeToggle = jest.fn();

  const { getByText } = render(
    <NetworkPageHeader {...props} onChangeToggle={onChangeToggle} />,
  );
  fireEvent.click(getByText('People'));
  expect(onChangeToggle.mock.calls.length).toBe(1);
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <NetworkPageHeader {...props} query={'test123'} />,
  );
  expect((getByRole('textbox') as HTMLInputElement).value).toEqual('test123');
});
