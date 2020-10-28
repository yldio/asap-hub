import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModalEditHeader from '../ModalEditHeader';

it('renders the header', () => {
  const { getByRole } = render(<ModalEditHeader title="Edit Link" />);
  expect(getByRole('heading').textContent).toEqual('Edit Link');
});

it('calls the save function ', () => {
  const jestFn = jest.fn();
  const { getByText } = render(<ModalEditHeader title="" onSave={jestFn} />);
  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalled();
});

it('calls the close function ', () => {
  const jestFn = jest.fn();
  const { getByTitle } = render(<ModalEditHeader title="" onClose={jestFn} />);
  userEvent.click(getByTitle('Cross'));
  expect(jestFn).toHaveBeenCalled();
});
