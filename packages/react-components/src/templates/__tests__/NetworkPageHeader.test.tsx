import React, { ComponentProps } from 'react';
import { render, fireEvent } from '@testing-library/react';

import NetworkPageHeader from '../NetworkPageHeader';

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'teams',
  searchQuery: '',
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
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

  rerender(<NetworkPageHeader {...props} page={'users'} />);
  expect(getByText('Teams')).not.toBeChecked();
  expect(getByText('People')).toBeChecked();
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
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
    <NetworkPageHeader {...props} searchQuery={'test123'} />,
  );
  expect((getByRole('searchbox') as HTMLInputElement).value).toEqual('test123');
});
