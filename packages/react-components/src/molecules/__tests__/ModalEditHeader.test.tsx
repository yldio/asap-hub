import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModalEditHeader from '../ModalEditHeader';

const props: ComponentProps<typeof ModalEditHeader> = {
  title: '',
  backHref: '',
};
it('renders the header', () => {
  const { getByRole } = render(
    <ModalEditHeader {...props} title="Edit Link" />,
  );
  expect(getByRole('heading').textContent).toEqual('Edit Link');
});

it('calls the save function ', () => {
  const jestFn = jest.fn();
  const { getByText } = render(<ModalEditHeader {...props} onSave={jestFn} />);
  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalled();
});

it('Displays the back link', () => {
  const { getByTitle } = render(
    <ModalEditHeader {...props} backHref="/back" />,
  );
  expect(getByTitle('Cross').closest('a')).toHaveAttribute('href', '/back');
});
